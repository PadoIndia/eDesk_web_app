import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  EventGroupResponse,
  EventPayload,
  EventResponse,
} from "../../../types/event.types";
import eventGroupService from "../../../services/api-services/event-group.service";
import eventService from "../../../services/api-services/event.service";
import Modal from "../../../components/ui/modals";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: EventResponse | null;
  onSuccess: () => void;
}

interface GroupOption {
  label: string;
  value: number;
}

interface GroupOperationResult {
  groupId: number;
  groupName: string;
  success: boolean;
  error?: string;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}) => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<GroupOption[]>([]);
  const [groups, setGroups] = useState<EventGroupResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  // Ref to track if component is mounted to prevent memory leaks
  const isMountedRef = useRef(true);

  const isEdit = !!initialData;

  useEffect(() => {
    isMountedRef.current = true;

    if (isOpen) {
      loadGroups();
      populateFormData();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [isOpen, initialData]);

  const loadGroups = async () => {
    setIsLoadingGroups(true);
    try {
      const res = await eventGroupService.getAllEventGroups();
      if (res.status === "success" && isMountedRef.current) {
        setGroups(res.data);
      } else if (res.status !== "success") {
        toast.error("Failed to load event groups");
      }
    } catch (error) {
      console.error("Error loading groups:", error);
      if (isMountedRef.current) {
        toast.error("Failed to load event groups");
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoadingGroups(false);
      }
    }
  };

  const populateFormData = () => {
    if (initialData) {
      setEventName(initialData.eventName);
      setEventDate(new Date(initialData.date).toISOString().slice(0, 10));
      const mappedGroups = initialData.eventGroupMap.map((g) => ({
        label: g.group.groupName,
        value: g.groupId,
      }));
      setSelectedGroups(mappedGroups);
    } else {
      resetFormData();
    }
  };

  const resetFormData = () => {
    setEventName("");
    setEventDate("");
    setSelectedGroups([]);
  };

  const validateForm = (): boolean => {
    if (!eventName.trim()) {
      toast.error("Event name is required");
      return false;
    }
    if (!eventDate) {
      toast.error("Event date is required");
      return false;
    }
    return true;
  };

  const handleGroupOperations = async (
    addedGroups: number[],
    removedGroups: number[]
  ): Promise<{ success: boolean; results: GroupOperationResult[] }> => {
    const operations: Promise<GroupOperationResult>[] = [];

    // Add group operations
    addedGroups.forEach((groupId) => {
      const groupName =
        groups.find((g) => g.id === groupId)?.groupName || `Group ${groupId}`;
      operations.push(
        eventService
          .addToGroup(initialData!.id, groupId)
          .then((res) => ({
            groupId,
            groupName,
            success: res.status === "success",
            error: res.status !== "success" ? res.message : undefined,
          }))
          .catch((error) => ({
            groupId,
            groupName,
            success: false,
            error: error.message || "Unknown error occurred",
          }))
      );
    });

    // Remove group operations
    removedGroups.forEach((groupId) => {
      const groupName =
        groups.find((g) => g.id === groupId)?.groupName || `Group ${groupId}`;
      operations.push(
        eventService
          .removeFromGroup(initialData!.id, groupId)
          .then((res) => ({
            groupId,
            groupName,
            success: res.status === "success",
            error: res.status !== "success" ? res.message : undefined,
          }))
          .catch((error) => ({
            groupId,
            groupName,
            success: false,
            error: error.message || "Unknown error occurred",
          }))
      );
    });

    try {
      const results = await Promise.allSettled(operations);
      const processedResults: GroupOperationResult[] = results.map(
        (result, index) => {
          if (result.status === "fulfilled") {
            return result.value;
          } else {
            const groupId =
              index < addedGroups.length
                ? addedGroups[index]
                : removedGroups[index - addedGroups.length];
            const groupName =
              groups.find((g) => g.id === groupId)?.groupName ||
              `Group ${groupId}`;
            return {
              groupId,
              groupName,
              success: false,
              error: result.reason?.message || "Operation failed",
            };
          }
        }
      );

      const allSuccessful = processedResults.every((result) => result.success);
      return { success: allSuccessful, results: processedResults };
    } catch (error) {
      console.error("Unexpected error in group operations:", error);
      return {
        success: false,
        results: [...addedGroups, ...removedGroups].map((groupId) => ({
          groupId,
          groupName:
            groups.find((g) => g.id === groupId)?.groupName ||
            `Group ${groupId}`,
          success: false,
          error: "Unexpected error occurred",
        })),
      };
    }
  };

  const handleCreateEvent = async (): Promise<boolean> => {
    const selectedGroupIds = selectedGroups.map((g) => g.value);

    const payload: EventPayload = {
      eventName: eventName.trim(),
      date: new Date(eventDate).toISOString(),
      groupIds: selectedGroupIds,
    };

    try {
      const res = await eventService.createEvent(payload);
      if (res.status === "success") {
        toast.success(res.message || "Event created successfully");
        return true;
      } else {
        toast.error(res.message || "Failed to create event");
        return false;
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
      return false;
    }
  };

  const handleUpdateEvent = async (): Promise<boolean> => {
    if (!initialData) return false;

    const selectedGroupIds = selectedGroups.map((g) => g.value);
    const currentGroupIds = initialData.eventGroupMap.map((g) => g.groupId);

    // Determine changes
    const hasNameChanged = eventName.trim() !== initialData.eventName;
    const incomingDateISO = new Date(eventDate).toISOString();
    const hasDateChanged =
      incomingDateISO !== new Date(initialData.date).toISOString();

    const addedGroups = selectedGroupIds.filter(
      (id) => !currentGroupIds.includes(id)
    );
    const removedGroups = currentGroupIds.filter(
      (id) => !selectedGroupIds.includes(id)
    );

    const hasGroupChanges = addedGroups.length > 0 || removedGroups.length > 0;

    // Check if any changes were made
    if (!hasNameChanged && !hasDateChanged && !hasGroupChanges) {
      toast.info("No changes made");
      return false;
    }

    try {
      let eventUpdateSuccess = true;
      let groupUpdateSuccess = true;

      // Handle event property updates
      if (hasNameChanged || hasDateChanged) {
        const payload: Partial<EventPayload> = {};
        if (hasNameChanged) payload.eventName = eventName.trim();
        if (hasDateChanged) payload.date = incomingDateISO;

        const res = await eventService.updateEvent(initialData.id, payload);
        if (res.status !== "success") {
          toast.error(res.message || "Failed to update event details");
          eventUpdateSuccess = false;
        }
      }

      // Handle group updates
      let groupResults: GroupOperationResult[] = [];
      if (hasGroupChanges) {
        const { success, results } = await handleGroupOperations(
          addedGroups,
          removedGroups
        );
        groupUpdateSuccess = success;
        groupResults = results;
      }

      // Provide comprehensive feedback
      if (eventUpdateSuccess && groupUpdateSuccess) {
        toast.success("Event updated successfully");
        return true;
      } else if (!eventUpdateSuccess && !groupUpdateSuccess) {
        toast.error("Failed to update event");
        return false;
      } else {
        // Partial success - provide detailed feedback
        const failedOperations = groupResults.filter((r) => !r.success);
        if (failedOperations.length > 0) {
          const failedGroups = failedOperations
            .map((r) => r.groupName)
            .join(", ");
          toast.warning(
            `Event updated, but failed to update groups: ${failedGroups}`
          );
        } else {
          toast.success("Event updated successfully");
        }
        return true;
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm() || isLoading) return;

    setIsLoading(true);

    try {
      const success = isEdit
        ? await handleUpdateEvent()
        : await handleCreateEvent();

      if (success && isMountedRef.current) {
        resetFormData();
        onSuccess();
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    if (isLoading) return; // Prevent closing while operations are in progress
    resetFormData();
    onClose();
  };

  const groupOptions: GroupOption[] = groups.map((group) => ({
    label: group.groupName,
    value: group.id,
  }));

  const footer = (
    <div className="d-flex justify-content-end gap-2">
      <button
        className="btn btn-outline-secondary rounded-pill px-4"
        onClick={handleClose}
        disabled={isLoading}
      >
        Cancel
      </button>
      <button
        className="btn btn-primary rounded-pill px-4"
        onClick={handleSave}
        disabled={isLoading || isLoadingGroups}
      >
        {isLoading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            {isEdit ? "Updating..." : "Saving..."}
          </>
        ) : isEdit ? (
          "Update"
        ) : (
          "Save"
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Edit Event" : "Create New Event"}
      footer={footer}
      size="md"
    >
      <form className="event-form" onSubmit={(e) => e.preventDefault()}>
        <div className="mb-3">
          <label htmlFor="eventName" className="form-label fw-semibold">
            Event Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control rounded"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter event name"
            disabled={isLoading}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="eventDate" className="form-label fw-semibold">
            Event Date <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            className="form-control rounded"
            id="eventDate"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="eventGroups" className="form-label fw-semibold">
            Event Groups
          </label>
          <Select
            id="eventGroups"
            isMulti
            options={groupOptions}
            value={selectedGroups}
            onChange={(selected) =>
              setSelectedGroups(selected as GroupOption[])
            }
            classNamePrefix="react-select"
            placeholder={
              isLoadingGroups
                ? "Loading groups..."
                : "Select one or more groups"
            }
            isDisabled={isLoading || isLoadingGroups}
            isLoading={isLoadingGroups}
            noOptionsMessage={() =>
              isLoadingGroups ? "Loading..." : "No groups available"
            }
          />
        </div>
      </form>
    </Modal>
  );
};

export default EventModal;
