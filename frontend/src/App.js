import { useEffect, useState } from "react";
import ListingDetail from "./components/ListingDetail";
import HomePage from "./pages/HomePage";
import CreateListingPage from "./pages/CreateListingPage";
import "./styles.css";

const BASE_URL = "/api/listing";

function App() {
  const [page, setPage] = useState("home");

  const [listings, setListings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);

  const loadListings = async () => {
    const res = await fetch(BASE_URL);
    const data = await res.json();
    setListings(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadListings();
  }, []);

  const addListing = async (formData, imageFile) => {
    if (!formData.title || !formData.price) {
      alert("Title and price required");
      return;
    }

    let image_url = "";

    if (imageFile) {
      const fd = new FormData();
      fd.append("image", imageFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: fd
      });

      const uploadData = await uploadRes.json();
      image_url = uploadData.image_url;
    }

    await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, image_url })
    });

    loadListings();
  };

  const deleteListing = async (id) => {
    await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE"
    });

    loadListings();
  };

  const saveListing = async (listing) => {
    const userId = "demoUser";

    await fetch(`/api/saved/${userId}/${listing.listing_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: listing.title,
        price: listing.price,
        image_url: listing.image_url
      })
    });

    alert("Saved!");
  };

  //  Start editing
  const startEditing = (listing) => {
    setEditing(listing);
    setPage("create");
  };

  //  Update listing
  const updateListing = async (id, formData, imageFile) => {
    let image_url = formData.image_url;

    if (imageFile) {
      const fd = new FormData();
      fd.append("image", imageFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: fd
      });

      const uploadData = await uploadRes.json();
      image_url = uploadData.image_url;
    }

    await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, image_url })
    });

    loadListings();
    setEditing(null);
  };

  return (
    <div>
      {/*  Navigation Bar */}
      <div className="navbar">
        <div className="nav-left">Marketplace</div>

        <div className="nav-right">
          <button
            className={page === "home" ? "nav-btn active" : "nav-btn"}
            onClick={() => {
              setEditing(null);
              setPage("home");
            }}
          >
            Home
          </button>

          <button
            className={page === "create" ? "nav-btn active" : "nav-btn"}
            onClick={() => {
              setEditing(null);
              setPage("create");
            }}
          >
            Create Listing
          </button>
        </div>
      </div>

      {/* Page Switching */}
      {page === "home" && (
        <HomePage
          listings={listings}
          onSelect={setSelected}
          onDelete={deleteListing}
          onSave={saveListing}
          onEdit={startEditing}   
        />
      )}

      {page === "create" && (
        <CreateListingPage
          listings={listings}
          onAdd={addListing}
          onDelete={deleteListing}
          onSelect={setSelected}
          onEdit={startEditing}     
          onUpdate={updateListing}  
          editing={editing}        
        />
      )}

      {/* ⭐ Listing Detail Modal */}
      {selected && (
        <ListingDetail listing={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default App;
