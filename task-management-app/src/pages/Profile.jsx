import Navbar from "../components/Navbar";

function Profile() {
  return (
    <div className="app">

      <Navbar />

      <main className="dashboard">

        <h2>My Profile 👤</h2>

        <section className="tasks-section profile-card">

          <h3>Account Information</h3>

          <p>
            Name: Demo User
          </p>

          <p>
            Email: demo@example.com
          </p>

        </section>

      </main>

    </div>
  );
}

export default Profile;