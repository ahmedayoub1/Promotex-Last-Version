
# 🛍️ Promotex

Promotex is a web-based platform that connects local brands, micro-enterprises, and customers by providing a unified space to **sell** clothes Built as a graduation project, Promotex emphasizes UX design, accessibility, and community empowerment.

---

## 📌 Features

- 🧥 Sell fashion products from local sellers
- 🛒 Interactive product pages with real-time cart updates
- 🔐 Secure user authentication and role-based access (Admin, Seller, Customer)
- 📦 Product and order management for sellers
- 📊 Admin dashboard for monitoring activity and performance
- 💬 Contact form and social media integration
- 🌐 Responsive design for mobile and desktop

---

## 🛠️ Tech Stack

**Frontend**
- HTML5, CSS3, JavaScript
- Tailwind CSS for modern UI components
- Vanilla JS with DOM APIs

**Backend**
- ASP.NET MVC (C#)
- MS SQL Server
- RESTful API architecture

**Tools & Services**
- Git & GitHub for version control
- Postman for API testing
- Google Lighthouse for frontend performance
- Visual Studio for backend development

---

## 🚀 Getting Started

### Prerequisites

- Visual Studio or Visual Studio Code
- SQL Server or LocalDB
- .NET SDK
- Git

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ahmedayoub1/Promotex-Last-Version.git
   cd Promotex-Last-Version
   ```

2. **Open the project** in Visual Studio.

3. **Configure the database connection** in `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=YOUR_SERVER;Database=PromotexDB;Trusted_Connection=True;"
   }
   ```

4. **Apply database migrations** (if using EF Core) or set up tables manually.

5. **Run the project**:
   ```bash
   dotnet run
   ```

6. Open your browser and go to:
   ```
   http://localhost:5000
   ```

---

## 🧪 Testing & Quality Assurance

- APIs tested using **Postman**
- Performance measured using **Google Lighthouse**
- Backend monitoring tools: **Application Insights**, **SQL Profiler**
- UI validated for responsiveness and accessibility

---

## 📷 Screenshots

| Home Page | Product Page | Rental Form |
|-----------|--------------|-------------|
| *(Insert screenshot here)* | *(Insert screenshot here)* | *(Insert screenshot here)* |

---

## 📁 Project Structure

```
Promotex/
├── Controllers/
├── Models/
├── Views/
│   ├── Shared/
│   ├── Home/
│   └── Products/
├── wwwroot/
│   ├── css/
│   ├── js/
│   └── images/
├── appsettings.json
├── Program.cs
├── Startup.cs
```

---

## 🤝 Contributing

We welcome community contributions! Here's how you can help:

1. Fork the repository
2. Create a new branch (`feature/your-feature`)
3. Make your changes
4. Commit and push to your fork
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE.md) file for more details.

---

## 📬 Contact

**Promotex Development Team**  
👤 Ahmed Mohamed Ayoub (Team Leader & Front-End)  
👤 Hadeer Sameh (Front-End)
👤 Sarah Ibrahim (Front-End)
👤 Morin Maged (Back-End)
👤 Sandy Amir (Back-End)
👤 Sally Adel (Back-End)
👤 Mariam Sobhy (Back-End)
📧 [promotex.support@email.com](mailto:promotex.support@email.com)  
🔗 [https://github.com/ahmedayoub1/Promotex-Last-Version](https://github.com/ahmedayoub1/Promotex-Last-Version)

---

## 🙌 Acknowledgements

- Thanks to all instructors and mentors who guided the project
- Built with love and passion for local brands and digital commerce
- Inspired by community needs and fashion-forward thinking
