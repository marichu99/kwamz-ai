import { useState } from "react";

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com" },
  ]);

  const addUser = () => {
    const name = prompt("Name?");
    const email = prompt("Email?");
    setUsers([...users, { id: Date.now(), name, email }]);
  };

  const deleteUser = (id) => setUsers(users.filter(u => u.id !== id));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2>Users</h2>
        <button onClick={addUser} className="button">Add</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button onClick={() => deleteUser(u.id)} className="button-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
