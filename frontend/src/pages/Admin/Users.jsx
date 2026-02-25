import { useMemo, useState } from "react";

const MOCK_USERS = [
  { id: "u1", name: "Lina Braun", email: "lina@example.com", role: "User", status: "Active" },
  { id: "u2", name: "Omar Haddad", email: "omar@example.com", role: "Admin", status: "Active" },
  { id: "u3", name: "Maya Rossi", email: "maya@example.com", role: "User", status: "Suspended" },
  { id: "u4", name: "Jonas Klein", email: "jonas@example.com", role: "User", status: "Active" },
];

export default function Users() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredUsers = useMemo(() => {
    const text = query.trim().toLowerCase();
    return users.filter((user) => {
      const byText =
        !text ||
        user.name.toLowerCase().includes(text) ||
        user.email.toLowerCase().includes(text);
      const byStatus = statusFilter === "All" || user.status === statusFilter;
      return byText && byStatus;
    });
  }, [users, query, statusFilter]);

  function promoteUser(id) {
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, role: "Admin" } : user)));
  }

  function suspendUser(id) {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, status: user.status === "Suspended" ? "Active" : "Suspended" }
          : user
      )
    );
  }

  function deleteUser(id) {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  }

  return (
    <section className="admin-section">
      <header className="admin-sectionHeader">
        <h1>Users</h1>
        <p>Manage account roles and access status.</p>
      </header>

      {/* Backend integration points:
          GET /admin/users
          PATCH /admin/users/:id
          DELETE /admin/users/:id
      */}
      <div className="admin-toolbar">
        <input
          className="admin-input"
          type="search"
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="admin-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All statuses</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      <div className="admin-tableWrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`admin-pill admin-pill-${user.role.toLowerCase()}`}>{user.role}</span>
                </td>
                <td>
                  <span className={`admin-pill admin-pill-${user.status.toLowerCase()}`}>{user.status}</span>
                </td>
                <td className="admin-actionsCell">
                  <button type="button" onClick={() => promoteUser(user.id)}>Promote</button>
                  <button type="button" onClick={() => suspendUser(user.id)}>
                    {user.status === "Suspended" ? "Activate" : "Suspend"}
                  </button>
                  <button type="button" className="admin-dangerBtn" onClick={() => deleteUser(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!filteredUsers.length ? (
              <tr>
                <td colSpan="5" className="admin-emptyRow">No users found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
