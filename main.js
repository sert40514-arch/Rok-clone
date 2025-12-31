<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Rise of Kingdoms | Avant-Garde Edition</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="src/style.css">
</head>
<body class="bg-black overflow-hidden antialiased">
    <div id="ui-root" class="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
        <header class="flex justify-between items-start pointer-events-auto">
            <div id="resources" class="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl flex gap-6 text-white font-mono text-sm">
                <div>GOLD: <span id="gold-val" class="text-yellow-400">1000</span></div>
                <div>WOOD: <span id="wood-val" class="text-green-400">500</span></div>
            </div>
            <button class="bg-white text-black px-4 py-2 font-bold uppercase tracking-tighter hover:bg-yellow-400 transition-colors">Menu</button>
        </header>
    </div>

    <canvas id="gameCanvas" class="fixed inset-0"></canvas>

    <script type="module" src="src/main.js"></script>
</body>
</html>
