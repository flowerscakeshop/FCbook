<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FC Book</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
            },
            colors: {
              primary: '#2563eb', // blue-600
              secondary: '#475569', // slate-600
              success: '#16a34a', // green-600
              warning: '#ca8a04', // yellow-600
              danger: '#dc2626', // red-600
            }
          }
        }
      }
    </script>
    <style>
      /* Minimal print styles to ensure the invoice looks good on paper */
      @media print {
        body * {
          visibility: hidden;
        }
        #printable-area, #printable-area * {
          visibility: visible;
        }
        #printable-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
      }
    </style>
  <script type="importmap">
{
  "imports": {
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
    "lucide-react": "https://aistudiocdn.com/lucide-react@^0.555.0",
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "recharts": "https://aistudiocdn.com/recharts@^3.5.1"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
  <body class="bg-slate-50 text-slate-900 antialiased">
    <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>