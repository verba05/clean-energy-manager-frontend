import { useState } from "react";
import { useRouter } from "next/router";

const API = process.env.NEXT_PUBLIC_BACKEND_API_URL;



function formatDateTime(value) {
	const [datePart, timePart] = value.split("T");
	if (!datePart || !timePart) return value;

	const [year, month, day] = datePart.split("-");
	const [hour, minute] = timePart.split(":");

	return `${day}.${month}.${year} ${hour}:${minute}`;
}

export default function EVCharging() {
	const [hours, setHours] = useState(1);
	const [result, setResult] = useState(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function fetchData() {
		try {
			setLoading(true);
			setError("");
			console.log(API)
			const response = await fetch(`${API}/energy/optimal/ev?hours=${hours}`);

			if (!response.ok) {
				throw new Error(`Request failed with ${response.status}`);
			}

			const nextResult = await response.json();
			setResult(nextResult);
		} catch (err) {
			setResult(null);
			setError("Could not calculate the charging window.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<main className="pageShell">
			<header className="pageHeader">
				<div>
					<p className="pageKicker">EV planning</p>
					<h1 className="pageTitle">EV Charging Optimizer</h1>
					<p className="pageSubtitle">Pick the charging duration and get the best low-carbon window.</p>
				</div>
				<button className="pageLinkButton" onClick={() => router.push("/EnergyMix")}>
					Back to energy mix
				</button>
			</header>

			<section className="panel" style={{ margin: "0 1.25rem", maxWidth: 760 }}>
				<label className="fieldLabel" htmlFor="hours">
					Charging hours
				</label>

				<div className="formRow">
					<input
						id="hours"
						className="textInput"
						type="number"
						min={1}
						max={6}
						value={hours}
						onChange={(event) => setHours(Number(event.target.value))}
					/>
					<button className="primaryButton" onClick={fetchData} disabled={loading}>
						{loading ? "Working..." : "Find best window"}
					</button>
				</div>

				{error ? <p style={{ marginTop: "0.85rem", color: "#ffd1d1" }}>{error}</p> : null}

				{result ? (
					<div className="panel" style={{ marginTop: "1rem" }}>
						<p style={{ margin: "0 0 0.45rem" }}><strong>From:</strong> {formatDateTime(result.from)}</p>
						<p style={{ margin: "0 0 0.45rem" }}><strong>To:</strong> {formatDateTime(result.to)}</p>
						<p style={{ margin: 0 }}><strong>Clean energy:</strong> {result.cleanEnergyPercentage.toFixed(1)}%</p>
					</div>
				) : null}
			</section>
		</main>
	);
}