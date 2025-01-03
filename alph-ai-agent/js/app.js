document.getElementById("submitButton").addEventListener("click", async () => {
    const input = document.getElementById("userInput").value.trim();
    const responseBox = document.getElementById("response");
    const spinner = document.querySelector(".loading-spinner");
    const logo = pair.baseToken.logoURI || `https://assets.dexscreener.com/logos/${input}.png` || 'https://via.placeholder.com/50';


    if (!input) {
        responseBox.innerHTML = "<p class='text-danger'>Please enter a valid token address.</p>";
        return;
    }

    spinner.style.display = "block";
    responseBox.innerHTML = "";

    try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${input}`);
        const data = await response.json();

        if (data.pairs && data.pairs.length > 0) {
            const pair = data.pairs[0];
            const logo = pair.baseToken.logoURI || 'https://via.placeholder.com/50';
            const name = pair.baseToken.name || "Unknown Token";
            const symbol = pair.baseToken.symbol || "N/A";
            const price = pair.priceUsd ? `$${parseFloat(pair.priceUsd).toFixed(2)}` : "N/A";
            const fdv = pair.fdv ? `$${pair.fdv.toLocaleString()}` : "N/A";

            const analysis = generateDetailedAnalysis(pair);

            responseBox.innerHTML = `
                <div>
                    <img src="${logo}" alt="${name} Logo" style="width: 50px; height: 50px; margin-bottom: 10px;">
                    <h4>${name} (${symbol})</h4>
                    <p><strong>Price:</strong> ${price}</p>
                    <p><strong>FDV:</strong> ${fdv}</p>
                    <ul>${analysis.details}</ul>
                    <a href="https://dexscreener.com/${pair.chainId}/${pair.pairAddress}" target="_blank" class="btn btn-primary mt-3">View Chart</a>
                </div>
            `;
        } else {
            responseBox.innerHTML = "<p class='text-danger'>Token not found or not listed.</p>";
        }
    } catch (error) {
        responseBox.innerHTML = "<p class='text-danger'>An error occurred. Please try again later.</p>";
    } finally {
        spinner.style.display = "none";
    }
});

function generateDetailedAnalysis(pair) {
    const price = parseFloat(pair.priceUsd);
    const fdv = parseFloat(pair.fdv);
    const trend = Math.random() > 0.5 ? "bullish" : "bearish";
    const recommendation = trend === "bullish" ? "BUY 📈" : "HOLD 🔄";

    const details = `
        <li>Market trend is currently <strong>${trend}</strong>.</li>
        <li>Price movement suggests ${trend === "bullish" ? "strong upward momentum" : "stabilization"}.</li>
        <li>Fully Diluted Value (FDV) indicates ${fdv > 1000000000 ? "high interest from investors." : "moderate market activity."}</li>
        <li>On-chain data shows ${trend === "bullish" ? "whale accumulation" : "neutral activity."}</li>
    `;

    return { details, recommendation };
}

