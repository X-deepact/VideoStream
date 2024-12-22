export default function authHeader() {
    const userStr = localStorage.getItem("user");
    let user = null;
    if (userStr) {
			user = JSON.parse(userStr);
    }

    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` }; // for Node.js Express back-end
    } else {
      return { Authorization: null }; // for Node Express back-end
    }
  }