import { useState, useEffect } from "react";
import LeaveTypesTab from "./leave-config-components/leave-type-tab";
import LeaveSchemesTab from "./leave-config-components/leave-schemes-tab";
import SchemeConfigurationTab from "./leave-config-components/scheme-config-tab";
import Modal from "./leave-config-components/modal";
import LeaveTypeForm from "./leave-config-components/leave-type-form";
import LeaveSchemeForm from "./leave-config-components/leave-scheme-form";
import {
  LeaveTypeResponse,
  LeaveScheme,
  LeaveTypeScheme,
  IsEarned,
  CreateLeaveTypeRequest,
  UpdateLeaveTypeRequest,
  UpdateLeaveSchemeRequest,
  CreateLeaveSchemeRequest,
  CreateLeaveTypeSchemeRequest,
  UpdateLeaveTypeSchemeRequest,
} from "../../types/leave.types";
import leaveTypeService from "../../services/api-services/leave-type.service";
import leaveSchemeService from "../../services/api-services/leave-scheme.service";
import leaveTypeSchemeService from "../../services/api-services/leave-type-scheme.service";
import { toast } from "react-toastify";
import { Spinner } from "../../components/loading";

const LeaveConfiguration = () => {
  const [activeTab, setActiveTab] = useState("leave-types");

  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeResponse[]>([]);
  const [schemes, setSchemes] = useState<LeaveScheme[]>([]);
  const [configurations, setConfigurations] = useState<LeaveTypeScheme[]>([]);
  const [loading, setLoading] = useState(true);

  const [showTypeModal, setShowTypeModal] = useState(false);
  const [currentType, setCurrentType] = useState<LeaveTypeResponse | null>(
    null
  );
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [currentScheme, setCurrentScheme] = useState<LeaveScheme | null>(null);

  const [schemeId, setSchemeId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConfig, setNewConfig] = useState({
    leaveTypeId: 0,
    maxCarryForward: 0,
    allowedAfterMonths: 0 as number,
    isEarned: IsEarned.YES,
  });

  const currentSchemeConfig = schemes.find((s) => s.id === schemeId);
  const currentConfigs = configurations.filter(
    (c) => c.leaveSchemeId === schemeId
  );
  const availableLeaveTypes = leaveTypes.filter(
    (lt) => !currentConfigs.some((c) => c.leaveTypeId === lt.id)
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const [typesResponse, schemesResponse, configsResponse] =
        await Promise.all([
          leaveTypeService.getLeaveTypes(),
          leaveSchemeService.getLeaveSchemes(),
          leaveTypeSchemeService.getLeaveTypeSchemes(),
        ]);

      setLeaveTypes(typesResponse.data);
      setSchemes(schemesResponse.data);
      setConfigurations(configsResponse.data);

      if (schemesResponse.data.length > 0 && !schemeId) {
        setSchemeId(schemesResponse.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddType = () => {
    setCurrentType(null);
    setShowTypeModal(true);
  };

  const handleEditType = (type: LeaveTypeResponse) => {
    setCurrentType(type);
    setShowTypeModal(true);
  };

  const handleDeleteType = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this leave type? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await leaveTypeService.deleteLeaveType(id);
      setLeaveTypes((prev) => prev.filter((type) => type.id !== id));
      setConfigurations((prev) =>
        prev.filter((config) => config.leaveTypeId !== id)
      );
    } catch (error) {
      console.error("Failed to delete leave type:", error);
    }
  };

  const handleSaveType = async (type: LeaveTypeResponse) => {
    try {
      if (type.id) {
        const updateData: UpdateLeaveTypeRequest = {
          name: type.name,
          isPaid: type.isPaid,
          description: type.description,
        };
        const response = await leaveTypeService.updateLeaveType(
          type.id,
          updateData
        );
        if (response.status === "success") {
          setLeaveTypes((prev) =>
            prev.map((t) => (t.id === type.id ? response.data : t))
          );
          setShowTypeModal(false);
          toast.success(response.message);
        } else toast.error(response.message);
      } else {
        const createData: CreateLeaveTypeRequest = {
          name: type.name,
          isPaid: type.isPaid,
          description: type.description,
        };
        const response = await leaveTypeService.createLeaveType(createData);
        if (response.status === "success") {
          setLeaveTypes((prev) => [...prev, response.data]);
          toast.success(response.status);
          setShowTypeModal(false);
        } else toast.error(response.message);
      }
    } catch (error) {
      console.error("Failed to save leave type:", error);
    }
  };

  const handleAddScheme = () => {
    setCurrentScheme(null);
    setShowSchemeModal(true);
  };

  const handleEditScheme = (scheme: LeaveScheme) => {
    setCurrentScheme(scheme);
    setShowSchemeModal(true);
  };

  const handleDeleteScheme = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this leave scheme? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await leaveSchemeService.deleteLeaveScheme(id);
      setSchemes((prev) => prev.filter((scheme) => scheme.id !== id));
      setConfigurations((prev) =>
        prev.filter((config) => config.leaveSchemeId !== id)
      );

      if (schemeId === id) {
        const remainingSchemes = schemes.filter((s) => s.id !== id);
        setSchemeId(
          remainingSchemes.length > 0 ? remainingSchemes[0].id : null
        );
      }
    } catch (error) {
      console.error("Failed to delete leave scheme:", error);
    }
  };

  const handleSaveScheme = async (scheme: LeaveScheme) => {
    try {
      let response: { data: LeaveScheme };

      if (scheme.id) {
        const updateData: UpdateLeaveSchemeRequest = {
          name: scheme.name,
          description: scheme.description,
          slug: scheme.slug,
        };
        response = await leaveSchemeService.updateLeaveScheme(
          scheme.id,
          updateData
        );
        setSchemes((prev) =>
          prev.map((s) => (s.id === scheme.id ? response.data : s))
        );
      } else {
        const createData: CreateLeaveSchemeRequest = {
          name: scheme.name,
          description: scheme.description,
          slug: scheme.slug,
        };
        response = await leaveSchemeService.createLeaveScheme(createData);
        setSchemes((prev) => [...prev, response.data]);
      }

      setShowSchemeModal(false);
    } catch (error) {
      console.error("Failed to save leave scheme:", error);
    }
  };

  const handleConfigureScheme = (schemeId: number) => {
    setSchemeId(schemeId);
    setActiveTab("scheme-config");
  };

  const handleAddConfig = async () => {
    if (!schemeId || !newConfig.leaveTypeId) return;

    try {
      const configData: CreateLeaveTypeSchemeRequest = {
        ...newConfig,
        leaveSchemeId: schemeId,
      };

      const response = await leaveTypeSchemeService.createLeaveTypeScheme(
        configData
      );
      setConfigurations((prev) => [...prev, response.data]);

      setNewConfig({
        leaveTypeId: 0,
        maxCarryForward: 0,
        allowedAfterMonths: 0,
        isEarned: IsEarned.YES,
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding configuration:", error);
    }
  };

  const handleRemoveConfig = async (id: number) => {
    try {
      await leaveTypeSchemeService.deleteLeaveTypeScheme(id);
      setConfigurations((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error removing configuration:", error);
    }
  };

  const handleSaveAll = async () => {
    try {
      const updatePromises = currentConfigs.map((config) => {
        const updateData: UpdateLeaveTypeSchemeRequest = {
          maxCarryForward: config.maxCarryForward,
          allowedAfterMonths: config.allowedAfterMonths,
          isEarned: config.isEarned,
        };
        return leaveTypeSchemeService.updateLeaveTypeScheme(
          config.id,
          updateData
        );
      });

      await Promise.all(updatePromises);

      const updatedConfigsResponse =
        await leaveTypeSchemeService.getLeaveTypeSchemes();
      setConfigurations(updatedConfigsResponse.data);
    } catch (error) {
      console.error("Failed to save configurations:", error);
    }
  };

  const updateConfigCarryForward = (
    configId: number,
    maxCarryForward: number
  ) => {
    setConfigurations((prev) =>
      prev.map((c) => (c.id === configId ? { ...c, maxCarryForward } : c))
    );
  };

  const updateConfigAllowedAfterMonths = (
    configId: number,
    allowedAfterMonths?: number
  ) => {
    setConfigurations((prev) =>
      prev.map((c) => (c.id === configId ? { ...c, allowedAfterMonths } : c))
    );
  };

  const updateConfigIsEarned = (configId: number, isEarned: IsEarned) => {
    setConfigurations((prev) =>
      prev.map((c) => (c.id === configId ? { ...c, isEarned } : c))
    );
  };

  const handleUpdateNewConfig = (config: {
    leaveTypeId: number;
    maxCarryForward: number;
    allowedAfterMonths: number;
    isEarned: IsEarned;
  }) => {
    setNewConfig(config);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="">
      <ul className="nav nav-tabs" id="leaveConfigTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${
              activeTab === "leave-types" ? "active" : ""
            }`}
            onClick={() => setActiveTab("leave-types")}
          >
            Leave Types
            {leaveTypes.length > 0 && (
              <span className="badge bg-secondary ms-2">
                {leaveTypes.length}
              </span>
            )}
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${
              activeTab === "leave-schemes" ? "active" : ""
            }`}
            onClick={() => setActiveTab("leave-schemes")}
          >
            Leave Schemes
            {schemes.length > 0 && (
              <span className="badge bg-secondary ms-2">{schemes.length}</span>
            )}
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${
              activeTab === "scheme-config" ? "active" : ""
            }`}
            onClick={() => setActiveTab("scheme-config")}
          >
            Scheme Configuration
            {currentSchemeConfig && (
              <span className="badge bg-primary ms-2">
                {currentSchemeConfig.name}
              </span>
            )}
          </button>
        </li>
        <div className="ms-auto">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={fetchData}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </button>
        </div>
      </ul>

      <div className="tab-content py-1 border-0 rounded-bottom">
        {activeTab === "leave-types" && (
          <LeaveTypesTab
            leaveTypes={leaveTypes}
            loading={loading}
            onAddType={handleAddType}
            onEditType={handleEditType}
            onDeleteType={handleDeleteType}
          />
        )}

        {activeTab === "leave-schemes" && (
          <LeaveSchemesTab
            schemes={schemes}
            loading={loading}
            onAddScheme={handleAddScheme}
            onEditScheme={handleEditScheme}
            onDeleteScheme={handleDeleteScheme}
            onConfigureScheme={handleConfigureScheme}
          />
        )}

        {activeTab === "scheme-config" && (
          <SchemeConfigurationTab
            schemes={schemes}
            schemeId={schemeId}
            currentConfigs={currentConfigs}
            availableLeaveTypes={availableLeaveTypes}
            showAddForm={showAddForm}
            newConfig={newConfig}
            loading={loading}
            onSelectScheme={setSchemeId}
            onSaveAll={handleSaveAll}
            onShowAddForm={() => setShowAddForm(true)}
            onHideAddForm={() => setShowAddForm(false)}
            onAddConfig={handleAddConfig}
            onRemoveConfig={handleRemoveConfig}
            onUpdateConfigCarryForward={updateConfigCarryForward}
            onUpdateConfigAllowedAfterMonths={updateConfigAllowedAfterMonths}
            onUpdateConfigIsEarned={updateConfigIsEarned}
            onUpdateNewConfig={handleUpdateNewConfig}
          />
        )}
      </div>

      <Modal
        show={showTypeModal}
        title={currentType ? "Edit Leave Type" : "Add New Leave Type"}
        onClose={() => setShowTypeModal(false)}
      >
        <LeaveTypeForm
          type={currentType}
          onSave={handleSaveType}
          onCancel={() => setShowTypeModal(false)}
        />
      </Modal>

      <Modal
        show={showSchemeModal}
        title={currentScheme ? "Edit Leave Scheme" : "Add New Leave Scheme"}
        onClose={() => setShowSchemeModal(false)}
      >
        <LeaveSchemeForm
          scheme={currentScheme}
          onSave={handleSaveScheme}
          onCancel={() => setShowSchemeModal(false)}
        />
      </Modal>
    </div>
  );
};

export default LeaveConfiguration;
