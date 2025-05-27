import { useState } from "react";
import { useLeaveConfiguration } from "./leave-config-components/hooks";
import LeaveTypesTab from "./leave-config-components/leave-type-tab";
import LeaveSchemesTab from "./leave-config-components/leave-schemes-tab";
import SchemeConfigurationTab from "./leave-config-components/scheme-config-tab";
import Modal from "./leave-config-components/modal";
import LeaveTypeForm from "./leave-config-components/leave-type-form";
import LeaveSchemeForm from "./leave-config-components/leave-scheme-form";
import { LeaveType, LeaveScheme, IsEarned } from "../../types/leave.types";

const LeaveConfiguration = () => {
  // Local state for active tab
  const [activeTab, setActiveTab] = useState("leave-types");
  
  const {
    // Data state
    leaveTypes,
    schemes,
    // configurations,
    loading,
    
    // Modal state
    showTypeModal,
    currentType,
    showSchemeModal,
    currentScheme,
    
    // Configuration state
    schemeId,
    showAddForm,
    newConfig,
    currentConfigs,
    availableLeaveTypes,
    currentSchemeConfig,
    
    // Leave type actions
    handleAddType,
    handleEditType,
    handleDeleteType,
    handleSaveType,
    
    // Leave scheme actions
    handleAddScheme,
    handleEditScheme,
    handleDeleteScheme,
    handleSaveScheme,
    
    // Configuration actions
    handleAddConfig,
    handleRemoveConfig,
    handleSaveAll,
    updateConfigCarryForward,
    updateConfigAllowedAfterMonths,
    updateConfigIsEarned,
    
    // Utility actions
    fetchData,
    
    // State setters
    setShowTypeModal,
    setShowSchemeModal,
    setSchemeId,
    setShowAddForm,
    setNewConfig,
  } = useLeaveConfiguration();

  // Handle tab switching
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Handle configure scheme (switch to config tab and set scheme)
  const handleConfigureScheme = (schemeId: number) => {
    setSchemeId(schemeId);
    setActiveTab("scheme-config");
  };

  // Handle save operations with loading states
  const handleSaveTypeWithLoading = async (type: LeaveType) => {
    try {
      await handleSaveType(type);
      setShowTypeModal(false);
    } catch (error) {
      // Handle error (you might want to show a toast notification)
      console.error("Failed to save leave type:", error);
    }
  };

  const handleSaveSchemeWithLoading = async (scheme: LeaveScheme) => {
    try {
      await handleSaveScheme(scheme);
      setShowSchemeModal(false);
    } catch (error) {
      // Handle error (you might want to show a toast notification)
      console.error("Failed to save leave scheme:", error);
    }
  };

  // Handle new config updates with proper type matching
  const handleUpdateNewConfig = (config: { 
    leaveTypeId: number; 
    maxCarryForward: number; 
    allowedAfterMonths?: number; 
    isEarned: IsEarned; 
  }) => {
    setNewConfig({
      leaveTypeId: config.leaveTypeId,
      maxCarryForward: config.maxCarryForward,
      allowedAfterMonths: config.allowedAfterMonths,
      isEarned: config.isEarned,
    });
  };

  const handleDeleteTypeWithConfirm = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this leave type? This action cannot be undone.")) {
      try {
        await handleDeleteType(id);
      } catch (error) {
        console.error("Failed to delete leave type:", error);
        // You might want to show an error notification here
      }
    }
  };

  const handleDeleteSchemeWithConfirm = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this leave scheme? This action cannot be undone.")) {
      try {
        await handleDeleteScheme(id);
      } catch (error) {
        console.error("Failed to delete leave scheme:", error);
        // You might want to show an error notification here
      }
    }
  };

  const handleSaveAllWithLoading = async () => {
    try {
      await handleSaveAll();
      // You might want to show a success notification here
    } catch (error) {
      console.error("Failed to save configurations:", error);
      // You might want to show an error notification here
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Leave Configuration</h1>
        <button 
          className="btn btn-outline-secondary btn-sm" 
          onClick={fetchData}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          Refresh
        </button>
      </div>

      {/* Tabs navigation */}
      <ul className="nav nav-tabs" id="leaveConfigTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "leave-types" ? "active" : ""}`}
            id="leave-types-tab"
            type="button"
            role="tab"
            aria-controls="leave-types"
            aria-selected={activeTab === "leave-types"}
            onClick={() => handleTabClick("leave-types")}
          >
            Leave Types
            {leaveTypes.length > 0 && (
              <span className="badge bg-secondary ms-2">{leaveTypes.length}</span>
            )}
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "leave-schemes" ? "active" : ""}`}
            id="leave-schemes-tab"
            type="button"
            role="tab"
            aria-controls="leave-schemes"
            aria-selected={activeTab === "leave-schemes"}
            onClick={() => handleTabClick("leave-schemes")}
          >
            Leave Schemes
            {schemes.length > 0 && (
              <span className="badge bg-secondary ms-2">{schemes.length}</span>
            )}
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "scheme-config" ? "active" : ""}`}
            id="scheme-config-tab"
            type="button"
            role="tab"
            aria-controls="scheme-config"
            aria-selected={activeTab === "scheme-config"}
            onClick={() => handleTabClick("scheme-config")}
          >
            Scheme Configuration
            {currentSchemeConfig && (
              <span className="badge bg-primary ms-2">{currentSchemeConfig.name}</span>
            )}
          </button>
        </li>
      </ul>

      <div className="tab-content p-3 border border-top-0 rounded-bottom" id="leaveConfigTabsContent">
        {/* Leave Types Tab */}
        <div 
          className={`tab-pane fade ${activeTab === "leave-types" ? "show active" : ""}`}
          id="leave-types"
          role="tabpanel"
          aria-labelledby="leave-types-tab"
        >
          <LeaveTypesTab
            leaveTypes={leaveTypes}
            loading={loading}
            onAddType={handleAddType}
            onEditType={handleEditType}
            onDeleteType={handleDeleteTypeWithConfirm}
          />
        </div>

        {/* Leave Schemes Tab */}
        <div 
          className={`tab-pane fade ${activeTab === "leave-schemes" ? "show active" : ""}`}
          id="leave-schemes"
          role="tabpanel"
          aria-labelledby="leave-schemes-tab"
        >
          <LeaveSchemesTab
            schemes={schemes}
            loading={loading}
            onAddScheme={handleAddScheme}
            onEditScheme={handleEditScheme}
            onDeleteScheme={handleDeleteSchemeWithConfirm}
            onConfigureScheme={handleConfigureScheme}
          />
        </div>

        {/* Scheme Configuration Tab */}
        <div 
          className={`tab-pane fade ${activeTab === "scheme-config" ? "show active" : ""}`}
          id="scheme-config"
          role="tabpanel"
          aria-labelledby="scheme-config-tab"
        >
          <SchemeConfigurationTab
            schemes={schemes}
            schemeId={schemeId}
            currentConfigs={currentConfigs}
            availableLeaveTypes={availableLeaveTypes}
            showAddForm={showAddForm}
            newConfig={newConfig}
            loading={loading}
            onSelectScheme={setSchemeId}
            onSaveAll={handleSaveAllWithLoading}
            onShowAddForm={() => setShowAddForm(true)}
            onHideAddForm={() => setShowAddForm(false)}
            onAddConfig={handleAddConfig}
            onRemoveConfig={handleRemoveConfig}
            onUpdateConfigCarryForward={updateConfigCarryForward}
            onUpdateConfigAllowedAfterMonths={updateConfigAllowedAfterMonths}
            onUpdateConfigIsEarned={updateConfigIsEarned}
            onUpdateNewConfig={handleUpdateNewConfig}
          />
        </div>
      </div>

      {/* Leave Type Modal */}
      <Modal
        show={showTypeModal}
        title={currentType ? "Edit Leave Type" : "Add New Leave Type"}
        onClose={() => setShowTypeModal(false)}
      >
        <LeaveTypeForm
          type={currentType}
          onSave={handleSaveTypeWithLoading}
          onCancel={() => setShowTypeModal(false)}
        />
      </Modal>

      {/* Leave Scheme Modal */}
      <Modal
        show={showSchemeModal}
        title={currentScheme ? "Edit Leave Scheme" : "Add New Leave Scheme"}
        onClose={() => setShowSchemeModal(false)}
      >
        <LeaveSchemeForm
          scheme={currentScheme}
          onSave={handleSaveSchemeWithLoading}
          onCancel={() => setShowSchemeModal(false)}
        />
      </Modal>
    </div>
  );
};

export default LeaveConfiguration;