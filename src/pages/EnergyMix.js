import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const API = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const COLORS = [
    "#f94144",
    "#577590",
    "#90be6d",
    "#9b5de5",
    "#43aa8b", 
    "#f8961e", 
    "#adb5bd", 
    "#00b4d8",
    "#ffd60a", 
];

export default function EnergyMix() {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        let active = true;

        async function load() {
            try {
                setError("");

                const response = await fetch(`${API}/energy/statistics`);

                if (!response.ok) {
                    throw new Error();
                }

                const result = await response.json();

                console.log(result)

                if (active) {
                    setData(result);
                }
            } catch {
                if (active) {
                    setError("Could not load energy mix data.");
                    setData([]);
                }
            }
        }

        load();

        return () => {
            active = false;
        };
    }, []);

    return (
        <main className="pageShell">
            <header className="pageHeader">
                <div>

                    <h1 className="pageTitle">
                        Energy Mix Overview
                    </h1>

                </div>

                <button
                    onClick={() => router.push("/EVCharging")}
                    className="pageLinkButton"
                >
                    Open EV charging planner
                </button>
            </header>

            {error && (
                <p style={{ color: "#ffb4b4", marginBottom: 20 }}>
                    {error}
                </p>
            )}

            <section
                style={{
                    display: "flex",
                    gap: "1.5rem",
                    overflowX: "auto",
                    paddingBottom: "1rem",
                }}
            >
                {data.map((day) => {
                    const chartData = [
                        { name: "Gas", value: day.gasPercentage },
                        { name: "Coal", value: day.coalPercentage },
                        { name: "Biomass", value: day.biomassPercentage },
                        { name: "Nuclear", value: day.nuclearPercentage },
                        { name: "Hydro", value: day.hydroPercentage },
                        { name: "Imports", value: day.importsPercentage },
                        { name: "Other", value: day.otherPercentage },
                        { name: "Wind", value: day.windPercentage },
                        { name: "Solar", value: day.solarPercentage },
                    ];

                    return (
                        <article
                            key={day.date}
                            className="panel"
                            style={{
                                minWidth: 420,
                                padding: "1.25rem",
                                flexShrink: 0,
                            }}
                        >
                            <h2
                                style={{
                                    marginBottom: "1rem",
                                    textAlign: "center",
                                }}
                            >
                                {day.date}
                            </h2>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "1rem",
                                }}
                            >
                                <div
                                    style={{
                                        width: 230,
                                        height: 230,
                                    }}
                                >
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                dataKey="value"
                                                nameKey="name"
                                                outerRadius={85}
                                            >
                                                {chartData.map((entry, i) => (
                                                    <Cell
                                                        key={entry.name}
                                                        fill={
                                                            COLORS[
                                                                i %
                                                                    COLORS.length
                                                            ]
                                                        }
                                                    />
                                                ))}
                                            </Pie>

                                            <Tooltip
                                                formatter={(value) =>
                                                    `${Number(value).toFixed(
                                                        1
                                                    )}%`
                                                }
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        minWidth: 120,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "0.9rem",
                                            color: "#999",
                                            marginBottom: 8,
                                        }}
                                    >
                                        Clean Energy
                                    </span>

                                    <span
                                        style={{
                                            fontSize: "2.4rem",
                                            fontWeight: "bold",
                                            color: "#2ec4b6",
                                        }}
                                    >
                                        {day.cleanEnergyPercentage.toFixed(1)}%
                                    </span>
                                </div>
                            </div>

                            <div
                                style={{
                                    marginTop: "1.25rem",
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(3, 1fr)",
                                    gap: "0.5rem",
                                    fontSize: ".9rem",
                                }}
                            >
                                {chartData.map((item, i) => (
                                    <div
                                        key={item.name}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: ".5rem",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: "50%",
                                                background:
                                                    COLORS[
                                                        i %
                                                            COLORS.length
                                                    ],
                                            }}
                                        />

                                        <span>
                                            {item.name}:{" "}
                                            {item.value.toFixed(1)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </article>
                    );
                })}
            </section>
        </main>
    );
}