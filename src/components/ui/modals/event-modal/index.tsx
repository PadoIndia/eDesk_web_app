"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import Modal from "..";
import "./styles.scss";
import eventGroupService from "../../../../services/api-services/event-group.service";
import eventService from "../../../../services/api-services/event.service";
import {
  EventGroupResponse,
  EventPayload,
  EventResponse,
} from "../../../../types/event.types";
import { toast } from "react-toastify";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: EventResponse | null;
}

interface GroupOption {
  label: string;
  value: number;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<GroupOption[]>([]);
  const [groups, setGroups] = useState<EventGroupResponse[]>([]);
  const isEdit = !!initialData;

  useEffect(() => {
    if (isOpen) {
      eventGroupService.getAllEventGroups().then((res) => {
        if (res.status === "success") {
          setGroups(res.data);
        }
      });

      if (initialData) {
        setEventName(initialData.eventName);
        setEventDate(new Date(initialData.date).toISOString().slice(0, 10));
        const mappedGroups = initialData.eventGroupMap.map((g) => ({
          label: g.group.groupName,
          value: g.groupId,
        }));
        setSelectedGroups(mappedGroups);
      } else {
        setEventName("");
        setEventDate("");
        setSelectedGroups([]);
      }
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    if (!eventName || !eventDate) {
      toast.error("Please fill all required fields.");
      return;
    }

    const selectedGroupIds = selectedGroups.map((g) => g.value);

    let payload: Partial<EventPayload> = {};

    if (isEdit) {
      if (eventName !== initialData!.eventName) {
        payload.eventName = eventName;
      }

      const incomingDateISO = new Date(eventDate).toISOString();
      if (incomingDateISO !== new Date(initialData!.date).toISOString()) {
        payload.date = incomingDateISO;
      }

      const addedGroups = selectedGroupIds.filter(
        (id) => !initialData!.eventGroupMap.some((g) => g.groupId === id)
      );

      const removedGroups = initialData!.eventGroupMap
        .filter((g) => !selectedGroupIds.includes(g.groupId))
        .map((g) => g.groupId);

      addedGroups.forEach((groupId) => {
        eventService.addToGroup(initialData!.id, groupId).then((res) => {
          if (res.status !== "success") {
            console.log(res.message);
          } else toast.error(res.message);
        });
      });

      removedGroups.forEach((groupId) => {
        eventService.removeFromGroup(initialData!.id, groupId).then((res) => {
          if (res.status !== "success") {
            console.log(res.message);
          } else toast.error(res.message);
        });
      });

      if (
        Object.keys(payload).length === 0 &&
        !addedGroups.length &&
        !removedGroups.length
      ) {
        toast.info("No changes made.");
        return;
      }
    } else {
      payload = {
        eventName,
        date: new Date(eventDate).toISOString(),
        groupIds: selectedGroupIds,
      };
    }

    const resetForm = () => {
      setEventName("");
      setEventDate("");
      setSelectedGroups([]);
      onClose();
    };
    if (!Object.keys(payload).length) return;

    const request = isEdit
      ? eventService.updateEvent(initialData!.id, payload)
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        eventService.createEvent(payload as any);

    request.then((res) => {
      if (res.status === "success") {
        toast.success(res.message);
        resetForm();
      } else {
        toast.error(res.message);
      }
    });
  };

  const groupOptions: GroupOption[] = groups.map((group) => ({
    label: group.groupName,
    value: group.id,
  }));

  const footer = (
    <div className="d-flex justify-content-end gap-2">
      <button
        className="btn btn-outline-secondary rounded-pill px-4"
        onClick={onClose}
      >
        Cancel
      </button>
      <button
        className="btn btn-primary rounded-pill px-4"
        onClick={handleSave}
      >
        {isEdit ? "Update" : "Save"}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Event" : "Create New Event"}
      footer={footer}
      size="md"
    >
      <form className="event-form">
        <div className="mb-3">
          <label htmlFor="eventName" className="form-label fw-semibold">
            Event Name
          </label>
          <input
            type="text"
            className="form-control rounded"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter event name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="eventDate" className="form-label fw-semibold">
            Event Date
          </label>
          <input
            type="date"
            className="form-control rounded"
            id="eventDate"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
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
            placeholder="Select one or more groups"
          />
        </div>
      </form>
    </Modal>
  );
};

export default EventModal;
