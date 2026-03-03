🚀 Serve2Save 

Serve2Save is a location-based allocation engine that intelligently matches food donation listings to NGOs using distance optimization and fairness-aware scoring.

The system is designed to prevent allocation bias while maintaining operational efficiency.

🧠 Core Concept

Naive nearest-distance matching systems create imbalance over time. Some NGOs become overloaded while others remain underutilized.

Serve2Save introduces a scoring model that balances:

📍 Geographic proximity

⚖ Fairness penalties based on historical allocations

🔁 Cooldown logic to prevent repeated selection

The objective is efficient yet equitable resource distribution.

⚙ Allocation Logic

Each NGO is evaluated using a composite scoring model.

The final score considers:

📏 Distance between listing and NGO

📊 Allocation frequency penalty

⏳ Recent selection penalty

The NGO with the optimal final score is selected.

This approach ensures the system remains transparent, deterministic, and fairness-aware.

🗺 Key Features

📌 Create geo-tagged donation listings

🤝 Intelligent NGO matching engine

📈 Real-time match distribution visualization

📊 Live system statistics dashboard

🗺 Interactive map visualization using Leaflet

🌟 Visual highlighting of selected NGO

🗄 PostgreSQL-backed persistence layer

🧩 Modular service-based backend architecture

📊 System Metrics

The dashboard displays:

📦 Total Listings

🟢 Active Listings

🔢 Total Matches

📈 Match Distribution per NGO

⚖ Fairness Indicator (allocation balance)

These metrics provide visibility into both performance and equity.

🏗 Architecture Overview

Frontend

🌐 HTML

🎨 CSS

⚡ Vanilla JavaScript

🗺 Leaflet.js for interactive maps

Backend

🟢 Node.js

🚏 Express.js

🐘 PostgreSQL

Project Structure

📁 Public layer for UI components

🔌 Route layer for API endpoints

🧠 Service layer for matching logic

🧮 Utility layer for distance calculations

🚀 Application entry point managing server lifecycle

This separation ensures scalability and maintainability.

🗄 Database Design

The system maintains structured records for:

📍 Donation listings with geographic coordinates and status

🔗 Allocation matches linking listings to NGOs

🕓 Historical match data for fairness computation

The schema supports analytical queries for distribution tracking.

🔌 API Capabilities

The backend exposes endpoints to:

➕ Create new listings

▶ Trigger NGO matching

📊 Retrieve distribution statistics

📈 Retrieve system-level metrics

The API is designed for extensibility.

⚙ Setup Overview

Clone the repository

Install project dependencies

Configure database connection

Start the backend server

Access the dashboard locally

🎯 Why This Project Matters

Resource allocation systems often optimize purely for distance or speed.

Serve2Save demonstrates how algorithmic fairness can be embedded into real-world operational systems without sacrificing performance.

The architecture supports expansion into:

🚨 Disaster relief allocation

🌍 Resource distribution networks

🏥 Public service routing systems

🤖 Multi-agent fairness optimization platforms

🔮 Future Enhancements

📦 Capacity-aware allocation

🔥 Heatmap visualization

🧪 Stress-test simulation mode

🕘 Allocation history timeline

🔄 Real-time updates via WebSockets

🐳 Containerized deployment

🔁 CI/CD integration

👤 Author

Vijaya Bahskar K P
