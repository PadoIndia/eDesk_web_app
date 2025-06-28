import { useState, useEffect } from "react";
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
} from "../../../types/leave.types";
import leaveTypeService from "../../../services/api-services/leave-type.service";
import leaveSchemeService from "../../../services/api-services/leave-scheme.service";
import leaveTypeSchemeService from "../../../services/api-services/leave-type-scheme.service";

// Initial configuration for new config form
const initialConfig = {
  leaveTypeId: 0,
  maxCarryForward: 0,
  allowedAfterMonths: undefined as number | undefined,
  isEarned: IsEarned.YES,
};

export const useLeaveConfiguration = () => {
  // Data state
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeResponse[]>([]);
  const [schemes, setSchemes] = useState<LeaveScheme[]>([]);
  const [configurations, setConfigurations] = useState<LeaveTypeScheme[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [currentType, setCurrentType] = useState<LeaveTypeResponse | null>(
    null
  );
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [currentScheme, setCurrentScheme] = useState<LeaveScheme | null>(null);

  // Configuration state
  const [schemeId, setSchemeId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConfig, setNewConfig] = useState(initialConfig);

  // Fetch all data
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

      // Set default scheme if available
      if (schemesResponse.data.length > 0 && !schemeId) {
        setSchemeId(schemesResponse.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // You might want to set an error state here
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData();
  }, []);

  // Computed values
  const currentSchemeConfig = schemes.find((s) => s.id === schemeId);
  const currentConfigs = configurations.filter(
    (c) => c.leaveSchemeId === schemeId
  );
  const availableLeaveTypes = leaveTypes.filter(
    (lt) => !currentConfigs.some((c) => c.leaveTypeId === lt.id)
  );

  // Leave Type Actions
  const handleAddType = () => {
    console.log("Adding new leave type");
    setCurrentType(null);
    setShowTypeModal(true);
  };

  const handleEditType = (type: LeaveTypeResponse) => {
    setCurrentType(type);
    setShowTypeModal(true);
  };

  const handleDeleteType = async (id: number) => {
    try {
      await leaveTypeService.deleteLeaveType(id);
      setLeaveTypes((prev) => prev.filter((type) => type.id !== id));
      setConfigurations((prev) =>
        prev.filter((config) => config.leaveTypeId !== id)
      );
    } catch (error) {
      console.error("Error deleting leave type:", error);
      throw error;
    }
  };

  const handleSaveType = async (type: LeaveTypeResponse) => {
    try {
      let response: { data: LeaveTypeResponse };
      if (type.id) {
        const updateData: UpdateLeaveTypeRequest = {
          name: type.name,
          isPaid: type.isPaid,
          description: type.description,
        };
        response = await leaveTypeService.updateLeaveType(type.id, updateData);
        setLeaveTypes((prev) =>
          prev.map((t) => (t.id === type.id ? response.data : t))
        );
      } else {
        const createData: CreateLeaveTypeRequest = {
          name: type.name,
          isPaid: type.isPaid,
          description: type.description,
        };
        response = await leaveTypeService.createLeaveType(createData);
        setLeaveTypes((prev) => [...prev, response.data]);
      }
      return response.data;
    } catch (error) {
      console.error("Error saving leave type:", error);
      throw error;
    }
  };

  // Leave Scheme Actions
  const handleAddScheme = () => {
    setCurrentScheme(null);
    setShowSchemeModal(true);
  };

  const handleEditScheme = (scheme: LeaveScheme) => {
    setCurrentScheme(scheme);
    setShowSchemeModal(true);
  };

  const handleDeleteScheme = async (id: number) => {
    try {
      await leaveSchemeService.deleteLeaveScheme(id);
      setSchemes((prev) => prev.filter((scheme) => scheme.id !== id));
      setConfigurations((prev) =>
        prev.filter((config) => config.leaveSchemeId !== id)
      );

      // Update selected scheme if it was deleted
      if (schemeId === id) {
        const remainingSchemes = schemes.filter((s) => s.id !== id);
        setSchemeId(
          remainingSchemes.length > 0 ? remainingSchemes[0].id : null
        );
      }
    } catch (error) {
      console.error("Error deleting leave scheme:", error);
      throw error;
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
      return response.data;
    } catch (error) {
      console.error("Error saving leave scheme:", error);
      throw error;
    }
  };

  // Configuration Actions
  const handleAddConfig = async () => {
    if (!schemeId || !newConfig.leaveTypeId) return;

    try {
      // Use CreateLeaveTypeSchemeRequest type
      const configData: CreateLeaveTypeSchemeRequest = {
        ...newConfig,
        leaveSchemeId: schemeId,
      };

      const response = await leaveTypeSchemeService.createLeaveTypeScheme(
        configData
      );

      setConfigurations((prev) => [...prev, response.data]);

      // Update counts
      setLeaveTypes((prev) =>
        prev.map((lt) =>
          lt.id === newConfig.leaveTypeId
            ? { ...lt, schemesCount: (lt._count.schemes || 0) + 1 }
            : lt
        )
      );
      setSchemes((prev) =>
        prev.map((s) =>
          s.id === schemeId
            ? { ...s, leaveTypesCount: (s.leaveTypesCount || 0) + 1 }
            : s
        )
      );

      setNewConfig({ ...initialConfig });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding configuration:", error);
      throw error;
    }
  };

  const handleRemoveConfig = async (id: number) => {
    try {
      await leaveTypeSchemeService.deleteLeaveTypeScheme(id);
      const removedConfig = configurations.find((c) => c.id === id);

      setConfigurations((prev) => prev.filter((c) => c.id !== id));

      // Update counts
      if (removedConfig) {
        setLeaveTypes((prev) =>
          prev.map((lt) =>
            lt.id === removedConfig.leaveTypeId
              ? {
                  ...lt,
                  schemesCount: Math.max(0, (lt._count.schemes || 0) - 1),
                }
              : lt
          )
        );
        setSchemes((prev) =>
          prev.map((s) =>
            s.id === removedConfig.leaveSchemeId
              ? {
                  ...s,
                  leaveTypesCount: Math.max(0, (s.leaveTypesCount || 0) - 1),
                }
              : s
          )
        );
      }
    } catch (error) {
      console.error("Error removing configuration:", error);
      throw error;
    }
  };

  // Since there's no bulkUpdate method in the service, we'll update individually
  const handleSaveAll = async () => {
    try {
      // Use UpdateLeaveTypeSchemeRequest type for updates
      const updatePayload: UpdateLeaveTypeSchemeRequest[] = currentConfigs.map(
        (config) => ({
          maxCarryForward: config.maxCarryForward,
          allowedAfterMonths: config.allowedAfterMonths,
          isEarned: config.isEarned,
        })
      );

      await Promise.all(
        currentConfigs.map((config, index) =>
          leaveTypeSchemeService.updateLeaveTypeScheme(
            config.id,
            updatePayload[index]
          )
        )
      );

      // Refresh configurations
      const updatedConfigsResponse =
        await leaveTypeSchemeService.getLeaveTypeSchemes();
      setConfigurations(updatedConfigsResponse.data);
    } catch (error) {
      console.error("Error saving configurations:", error);
      throw error;
    }
  };

  // Configuration update methods
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

  return {
    // Data state
    leaveTypes,
    schemes,
    configurations,
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
  };
};
