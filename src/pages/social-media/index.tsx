import { useState, useEffect } from "react";
import "./styles.scss";
import SocialMediaTable from "./components/social-media-table";
import CreateAssetModal from "./components/create-asset-modal";
import EditAssetModal from "./components/edit-asset-modal";
import { SmAssetResponse, SmAssetPayload } from "../../types/sm-asset.types";
import Layout from "../../components/layout";
import smAssetService from "../../services/api-services/sm-asset.service";
import userService from "../../services/api-services/user.service";
import { toast } from "react-toastify";

export type User = {
  profileImg: {
    id: bigint | undefined;
    url: string | null;
  };
  id: number;
  name: string | null;
  username: string;
  status: string | null;
  isActive: boolean;
  lastSeen: Date | null;
  contact: string;
};

export default function SocialMediaManagement() {
  const [assets, setAssets] = useState<SmAssetResponse[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [usersLoading, setUsersLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<SmAssetResponse | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("");

  useEffect(() => {
    fetchAssets();
    fetchUsers();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await smAssetService.getAllAccounts();
      setAssets(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching social media assets:", err);
      setError("Failed to load social media assets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data);
      setUsersError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsersError(
        "Failed to load user data. Manager information may be incomplete."
      );
    } finally {
      setUsersLoading(false);
    }
  };

  const platforms = [...new Set(assets.map((asset) => asset.platform))];

  const handleCreateAsset = async (newAsset: SmAssetPayload) => {
    try {
      const response = await smAssetService.createAccount(newAsset);
      if (response.status === "success") {
        setShowCreateModal(false);
        toast.success(response.message);
        fetchUsers();
      } else toast.error(response.message);
    } catch (err) {
      console.error("Error creating social media asset:", err);
      alert("Failed to create social media asset. Please try again.");
    }
  };

  const handleUpdateAsset = async (updatedAsset: SmAssetResponse) => {
    try {
      const { id, ...assetData } = updatedAsset;
      const response = await smAssetService.updateAccount(id, assetData);
      if (response.status === "success") {
        toast.success(response.message);
        setAssets(
          assets.map((asset) =>
            asset.id === updatedAsset.id ? updatedAsset : asset
          )
        );
        setShowEditModal(false);
        setCurrentAsset(null);
      } else toast.error(response.message);
    } catch (err) {
      console.error("Error updating social media asset:", err);
      alert("Failed to update social media asset. Please try again.");
    }
  };

  const handleDeleteAsset = async (id: number) => {
    if (
      window.confirm("Are you sure you want to delete this social media asset?")
    ) {
      try {
        await smAssetService.deleteAccount(id);
        setAssets(assets.filter((asset) => asset.id !== id));
      } catch (err) {
        console.error("Error deleting social media asset:", err);
        alert("Failed to delete social media asset. Please try again.");
      }
    }
  };

  const handleEditAsset = async (asset: SmAssetResponse) => {
    try {
      const response = await smAssetService.getAccountById(asset.id);
      setCurrentAsset(response.data);
      setShowEditModal(true);
    } catch (err) {
      console.error("Error fetching asset details:", err);

      setCurrentAsset(asset);
      setShowEditModal(true);
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.channelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.channelUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.platform.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlatform =
      filterPlatform === "" || asset.platform === filterPlatform;

    return matchesSearch && matchesPlatform;
  });

  const getManagerName = (id: number) => {
    const user = users.find((u) => u.id === id);
    return user ? user.name || user.username : `Unknown (ID: ${id})`;
  };

  return (
    <Layout showSideBar={false}>
      <div className="container-fluid card social-media-management p-4">
        <div className="row mb-4">
          <div className="col">
            <h1 className="page-title">Social Media Management</h1>
            <p className="text-muted">
              Manage your social media channels and assets
            </p>
          </div>
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
            <button
              className="btn btn-sm btn-outline-danger ms-3"
              onClick={fetchAssets}
            >
              Retry
            </button>
          </div>
        )}
        {usersError && (
          <div className="alert alert-warning" role="alert">
            {usersError}
            <button
              className="btn btn-sm btn-outline-warning ms-3"
              onClick={fetchUsers}
            >
              Retry
            </button>
          </div>
        )}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search channels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
            >
              <option value="">All Platforms</option>
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3 text-end">
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <i className="bi bi-plus-lg me-1"></i> Add New Channel
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            {loading ? (
              <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading social media assets...</p>
              </div>
            ) : (
              <SocialMediaTable
                assets={filteredAssets}
                onEdit={handleEditAsset}
                onDelete={handleDeleteAsset}
                getManagerName={getManagerName}
              />
            )}
          </div>
        </div>
        {showCreateModal && (
          <CreateAssetModal
            show={showCreateModal}
            onSave={handleCreateAsset}
            onHide={() => setShowCreateModal(false)}
            managers={users.map((user) => ({
              id: user.id,
              name: user.name || user.username,
            }))}
            loading={usersLoading}
          />
        )}{" "}
        {/* Edit Modal */}
        {currentAsset && (
          <EditAssetModal
            show={showEditModal}
            onHide={() => {
              setShowEditModal(false);
              setCurrentAsset(null);
            }}
            asset={currentAsset}
            onUpdate={handleUpdateAsset}
            managers={users.map((user) => ({
              id: user.id,
              name: user.name || user.username,
            }))}
            loading={usersLoading}
          />
        )}
      </div>
    </Layout>
  );
}
