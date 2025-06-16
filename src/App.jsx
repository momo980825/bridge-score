import React, { useState } from "react";

export default function App() {
  const [level, setLevel] = useState(1);
  const [suit, setSuit] = useState("S");
  const [doubled, setDoubled] = useState("");
  const [result, setResult] = useState(0);
  const [vulnerable, setVulnerable] = useState(false);
  const [score, setScore] = useState("");

  function calculateScore() {
    const suitScores = { C: 20, D: 20, H: 30, S: 30, NT: 30 };
    const internalDoubled = doubled === "X" || doubled === "XX" ? doubled : "";
    let baseScore = 0;

    if (!(suit in suitScores)) {
      setScore("錯誤：不合法的花色");
      return;
    }

    if (suit === "NT") {
      baseScore = 40 + (level - 1) * 30;
    } else {
      baseScore = level * suitScores[suit];
    }

    if (internalDoubled === "X") baseScore *= 2;
    else if (internalDoubled === "XX") baseScore *= 4;

    if (result < 0) {
      let under = Math.abs(result);
      let penalty = 0;

      if (internalDoubled === "") {
        penalty = under * (vulnerable ? 100 : 50);
      } else {
        if (!vulnerable) {
          if (under === 1) penalty = 100;
          else if (under === 2) penalty = 300;
          else penalty = 300 + (under - 2) * 300;
        } else {
          penalty = 200 + (under - 1) * 300;
        }
        if (internalDoubled === "XX") penalty *= 2;
      }
      setScore(`未成局，扣分：-${penalty} 點（加倍狀況：${doubled || "無"}）`);
      return;
    }

    let contractScore = baseScore;
    if (internalDoubled === "X") contractScore += 50;
    else if (internalDoubled === "XX") contractScore += 100;

    let overScore = 0;
    if (internalDoubled === "") {
      overScore = result * suitScores[suit === "NT" ? "NT" : suit];
    } else {
      overScore = result * (internalDoubled === "XX" ? 200 : 100);
    }

    let total = contractScore + overScore;
    if (level === 7) total += vulnerable ? 1500 : 1000;
    else if (level === 6) total += vulnerable ? 750 : 500;
    else if (baseScore >= 100) total += vulnerable ? 500 : 300;
    else total += 50;

    setScore(`得分：${total} 點（合約得分 ${contractScore}，超墩得分 ${overScore}，加倍狀況：${doubled || "無"}）`);
  }

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
      <h1>橋牌計分器</h1>
      <label>合約等級 (1-7)：</label>
      <input type="number" value={level} onChange={e => setLevel(+e.target.value)} min={1} max={7} /><br />

      <label>花色 (C/D/H/S/NT)：</label>
      <input value={suit} onChange={e => setSuit(e.target.value.toUpperCase())} /><br />

      <label>加倍狀況（無 / X / XX）：</label>
      <input value={doubled} onChange={e => setDoubled(e.target.value.toUpperCase())} /><br />

      <label>實際結果（與合約的墩差）：</label>
      <input type="number" value={result} onChange={e => setResult(+e.target.value)} /><br />

      <label>
        <input type="checkbox" checked={vulnerable} onChange={e => setVulnerable(e.target.checked)} />
        是否為局況（Vulnerable）
      </label><br /><br />

      <button onClick={calculateScore}>計算得分</button><br /><br />

      <strong>{score}</strong>
    </div>
  );
}
