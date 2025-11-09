const { useState, useEffect } = React;

// Component chính của ứng dụng.
function App() {
  // State để lưu danh sách người dùng.
  const [users, setUsers] = useState([]);
  // State để lưu từ khóa tìm kiếm.
  const [kw, setKeyword] = useState("");
  // State để lưu người dùng mới được thêm vào.
  const [newUser, setNewUser] = useState(null);
  // State để lưu thông tin người dùng đang được chỉnh sửa.
  const [editing, setEditing] = useState(null);

  // useEffect để tải dữ liệu người dùng từ API khi component được mount.
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
      });
  }, []);

  // useEffect để thêm người dùng mới vào danh sách khi `newUser` thay đổi.
  useEffect(() => {
    if (newUser) {
      setUsers(prev => [...prev, { ...newUser, id: prev.length + 1 }]);
      setNewUser(null);
    }
  }, [newUser]);

  // Hàm để nhận dữ liệu người dùng mới từ component `AddUser`.
  const onAdd = (user) => {
    setNewUser(user);
  };

  // Hàm để reset `newUser` state sau khi đã thêm.
  const onAdded = () => {
    setNewUser(null);
  };

  // Hàm để set state `editing` khi người dùng nhấn nút "Sửa".
  const editUser = (user) => {
    setEditing({ ...user, address: { ...user.address } });
  };

  // Hàm để lưu thông tin người dùng sau khi chỉnh sửa.
  const saveUser = () => {
    setUsers(prev => prev.map(u => u.id === editing.id ? editing : u));
    setEditing(null);
  };

  // Hàm để xóa người dùng khỏi danh sách.
  const removeUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Hàm để cập nhật state `editing` khi người dùng thay đổi thông tin trong form chỉnh sửa.
  const handleEditChange = (field, value) => {
    setEditing(prev => ({ ...prev, [field]: value }));
  };

  // Lọc danh sách người dùng dựa trên từ khóa tìm kiếm.
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(kw.toLowerCase()) ||
      u.username.toLowerCase().includes(kw.toLowerCase())
  );

  // Render UI của component `App`.
  return (
    <div>
      <h1>Quản lý người dùng</h1>
      {/* Component form search tìm kiếm */}
      <SearchForm onChangeValue={setKeyword} />
      {/* Component form thêm người dùng */}
      <AddUser onAdd={onAdd} />
      {/* Component bảng kết quả */}
      <ResultTable
        users={filteredUsers}
        onEdit={editUser}
        onDelete={removeUser}
      />
      {/* Modal chỉnh sửa người dùng */}
      {editing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Chỉnh sửa người dùng</h4>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input id="name" type="text" value={editing.name} onChange={(e) => handleEditChange("name", e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input id="username" type="text" value={editing.username} onChange={(e) => handleEditChange("username", e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input id="email" type="text" value={editing.email} onChange={(e) => handleEditChange("email", e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="city">City:</label>
              <input id="city" type="text" value={editing.address.city} onChange={(e) => setEditing(prev => ({ ...prev, address: { ...prev.address, city: e.target.value } }))} />
            </div>
            <button onClick={saveUser}>Lưu</button>
            <button onClick={() => setEditing(null)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
}

// form tìm kiếm.
function SearchForm({ onChangeValue }) {
  return (
    <input
      type="text"
      placeholder="Tìm theo name, username"
      onChange={(e) => onChangeValue(e.target.value)}
    />
  );
}

// Component form thêm người dùng.
function AddUser({ onAdd }) {
  // State để kiểm soát việc hiển thị modal thêm người dùng.
  const [adding, setAdding] = useState(false);
  // State để lưu thông tin người dùng đang được nhập vào form.
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    address: { street: "", suite: "", city: "" },
    phone: "",
    website: "",
  });

  // Hàm để xử lý thay đổi trên các trường input.
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (["street", "suite", "city"].includes(id)) {
      setUser({ ...user, address: { ...user.address, [id]: value } });
    } else {
      setUser({ ...user, [id]: value });
    }
  };

  // Hàm để xử lý việc thêm người dùng mới.
  const handleAdd = () => {
    if (user.name === "" || user.username === "") {
      alert("Vui lòng nhập Name và Username!");
      return;
    }
    onAdd(user);
    setUser({
      name: "",
      username: "",
      email: "",
      address: { street: "", suite: "", city: "" },
      phone: "",
      website: "",
    });
    setAdding(false);
  };

  return (
    <div>
      <button onClick={() => setAdding(true)}>Thêm</button>
      {/* Modal thêm người dùng */}
      {adding && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Thêm người dùng</h4>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input id="name" type="text" value={user.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input id="username" type="text" value={user.username} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input id="email" type="text" value={user.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="city">City:</label>
              <input id="city" type="text" value={user.address.city} onChange={handleChange} />
            </div>
            <button onClick={handleAdd}>Thêm</button>
            <button onClick={() => setAdding(false)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Bảng hiển thị danh sách người dùng.
function ResultTable({ users, onEdit, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Username</th>
          <th>Email</th>
          <th>City</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.name}</td>
            <td>{u.username}</td>
            <td>{u.email}</td>
            <td>{u.address.city}</td>
            <td>
              <button onClick={() => onEdit(u)}>Sửa</button>
              <button onClick={() => onDelete(u.id)}>Xóa</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Render component `App` vào `div` có id là `root`.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);