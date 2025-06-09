import React, { useState, useEffect } from "react";
import { LuPlus, LuCalendar, LuArrowLeft } from "react-icons/lu";
import { toast } from "react-toastify";
import chatService from "../../../services/api-services/chat-service";
import { SingleChatResp } from "../../../types/chat";
import { User } from "../../../types/user.types";
import userService from "../../../services/api-services/user.service";
import ContactTile from "./contact-tile";

interface Props {
  id?: number;
  onSuccess: () => void;
}

type TaskPayload = {
  title: string;
  description: string | null;
  requiresSubmit: boolean;
  deadline: Date | null;
  taskPresetId: null | number;
};

const CreateTaskForm: React.FC<Props> = ({ id, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [payload, setPayload] = useState<TaskPayload>({
    title: "",
    description: "",
    requiresSubmit: false,
    deadline: new Date(),
    taskPresetId: null,
  });
  const [chatData, setChatData] = useState<SingleChatResp | null>(null);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [subTasks, setSubtasks] = useState<{ id: number; label: string }[]>([]);
  const [participants, setParticipants] = useState<number[]>([]);
  const [admins, setAdmins] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const taskPresets: { id: number; name: string }[] = [];

  useEffect(() => {
    if (id) {
      chatService.getChatDetails(id).then((res) => {
        if (res.status === "success") {
          const data = {
            title: res.data.title,
            description: res.data.description,
            requiresSubmit: res.data.requiresSubmit,
            taskPresetId: res.data.taskPresetId,
            deadline: new Date(res.data.deadline || Date.now()),
          };
          setSubtasks(
            res.data.subTask.map((s) => ({ id: s.id, label: s.key }))
          );
          setPayload(data);
          setChatData(res.data);
          setParticipants(res.data.participants.map((i) => i.user.id));
          setAdmins(
            res.data.participants.filter((i) => i.isAdmin).map((i) => i.user.id)
          );
        }
      });
    }
    userService.getAllUsers().then((res) => {
      if (res.status === "success") setUsers(res.data);
    });
  }, [id]);

  const addSubtask = () => {
    const input = subtaskInput.trim();
    if (input) {
      if (!subTasks.find((i) => i.label.toLowerCase() == input.toLowerCase())) {
        setSubtasks([...subTasks, { id: 0, label: input }]);
      }
      setSubtaskInput("");
    }
  };

  const removeSubtask = (index: number, subTaskId: number) => {
    if (id && subTaskId) {
      chatService.removeSubTask(id, subTaskId).then((res) => {
        if (res.status === "success") {
          console.log(res.status);
        } else toast.error(res.message);
      });
    }
    const updatedSubtasks = [...subTasks];
    updatedSubtasks.splice(index, 1);
    setSubtasks(updatedSubtasks);
  };

  const handleChange = <T extends keyof TaskPayload>(
    key: T,
    value: TaskPayload[T]
  ) => {
    setPayload((p) => ({
      ...p,
      [key]: value,
    }));
  };

  const handleNextStep = () => {
    if (payload.title.trim() === "") {
      toast.error("Title is required.");
      return;
    }
    setCurrentStep(2);
  };

  const handleBackStep = () => {
    setCurrentStep(1);
  };

  const toggleUserSelection = (user: User) => {
    if (id && participants.includes(user.id)) {
      chatService.removeParticipant(id, user.id).then((res) => {
        if (res.status !== "success") toast.error(res.message);
      });
    }
    setParticipants((prev) => {
      if (prev.includes(user.id)) {
        setAdmins((adminPrev) => adminPrev.filter((id) => id !== user.id));
        return prev.filter((id) => id !== user.id);
      } else {
        return [...prev, user.id];
      }
    });
  };

  const toggleAdminStatus = (user: User) => {
    if (id && chatData?.participants.find((u) => u.user.id === user.id)) {
      chatService
        .updateParticipant(id, user.id, !admins.includes(user.id))
        .then((res) => {
          if (res.status !== "success") toast.error(res.message);
        });
    }
    setAdmins((prev) => {
      if (prev.includes(user.id)) {
        return prev.filter((id) => id !== user.id);
      } else {
        return [...prev, user.id];
      }
    });
  };

  const handleSubmit = () => {
    if (payload.title.trim() === "") {
      toast.error("Title is required.");
      return;
    }
    const {
      title,
      deadline,
      description = "",
      taskPresetId,
      requiresSubmit,
    } = payload;
    const p = chatData?.participants || [];
    const pIds = p.map((i) => i.user.id);
    const adminIds = p.filter((i) => i.isAdmin).map((u) => u.user.id);
    const adminFiltered = admins.filter((i) => !adminIds.includes(i));
    const taskData = {
      taskPresetId,
      title,
      description,
      participants: participants.filter((i) => !pIds.includes(i)),
      admins: adminFiltered,
      subTasks: subTasks.filter((i) => !i.id || i.id <= 0).map((i) => i.label),
      requiresSubmit: requiresSubmit,
      deadline: deadline,
    };
    if (id) {
      chatService.updateChat(id, taskData).then((res) => {
        if (res.status === "success") {
          toast.success(res.message);
          onSuccess();
          setPayload({
            title: "",
            deadline: null,
            description: "",
            requiresSubmit: false,
            taskPresetId: null,
          });
        } else toast.error(res.message);
      });
    } else {
      chatService.createNewChat({ ...taskData, type: "TASK" }).then((res) => {
        if (res.status === "success") {
          toast.success(res.message);
          onSuccess();
          setPayload({
            title: "",
            deadline: null,
            description: "",
            requiresSubmit: false,
            taskPresetId: null,
          });
        } else toast.error(res.message);
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      e.target === document.querySelector("#subtask-input")
    ) {
      e.preventDefault();
      addSubtask();
    }
  };

  const renderStepOne = () => (
    <div style={{ overflow: "auto", maxHeight: "calc(90vh - 80px)" }}>
      <div className="p-4">
        {/* Task Preset Dropdown */}
        <div className="mb-3">
          <label className="form-label fw-medium">Task Preset</label>
          <select
            className="form-select"
            value={payload.taskPresetId || ""}
            onChange={(e) =>
              handleChange(
                "taskPresetId",
                e.target.value ? Number(e.target.value) : null
              )
            }
          >
            <option value="">Select Preset</option>
            {taskPresets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title Input */}
        <div className="mb-3">
          <label className="form-label fw-medium">
            Title <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control`}
            value={payload.title}
            onChange={(e) => handleChange("title", e.target.value)}
            maxLength={200}
            placeholder="Enter task title"
          />
        </div>

        {/* Description Input */}
        <div className="mb-3">
          <label className="form-label fw-medium">Description</label>
          <textarea
            className="form-control"
            rows={4}
            value={payload.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter task description"
          />
        </div>

        {/* Requires Submit Toggle */}
        <div className="mb-3">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="requiresSubmitSwitch"
              checked={payload.requiresSubmit}
              onChange={(e) => handleChange("requiresSubmit", e.target.checked)}
            />
            <label
              className="form-check-label fw-medium"
              htmlFor="requiresSubmitSwitch"
            >
              Requires Submit
            </label>
          </div>
        </div>

        {/* Deadline Picker */}
        <div className="mb-3">
          <label className="form-label fw-medium">Deadline</label>
          <div className="input-group">
            <input
              type="date"
              className="form-control"
              value={payload.deadline?.toISOString().split("T")[0]}
              onChange={(e) =>
                handleChange("deadline", new Date(e.target.value))
              }
            />
            <span className="input-group-text">
              <LuCalendar size={16} />
            </span>
          </div>
        </div>

        {/* Subtasks */}
        <div className="mb-4">
          <label className="form-label fw-medium">Subtasks</label>

          {/* Existing Subtasks */}
          {subTasks.length > 0 && (
            <div className="mb-3">
              {subTasks.map((subtask, index) => (
                <span
                  key={index}
                  className="badge bg-primary me-2 mb-2 d-inline-flex align-items-center"
                  style={{ fontSize: "0.875rem", padding: "0.5rem 0.75rem" }}
                >
                  {subtask.label}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-2"
                    style={{ fontSize: "0.6rem" }}
                    onClick={() => removeSubtask(index, subtask.id)}
                    aria-label="Remove subtask"
                  ></button>
                </span>
              ))}
            </div>
          )}

          {/* Add Subtask Input */}
          <div className="input-group">
            <input
              id="subtask-input"
              type="text"
              className="form-control"
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add subtask"
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={addSubtask}
            >
              <LuPlus size={16} />
            </button>
          </div>
        </div>

        {/* Next Button */}
        <div className="d-grid">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            disabled={payload.title.trim() === ""}
            onClick={handleNextStep}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div style={{ overflow: "auto", maxHeight: "calc(90vh - 80px)" }}>
      <div className="p-4">
        {/* Back Button */}
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center"
            onClick={handleBackStep}
          >
            <LuArrowLeft size={16} className="me-2" />
            Back
          </button>
        </div>

        {/* Add Participants Title */}
        <div className="mb-4">
          <h5 className="fw-bold mb-0">Add Participants</h5>
          <p className="text-muted small mb-0">
            Select team members and assign admin roles
          </p>
        </div>

        {/* Selected Count */}
        {participants.length > 0 && (
          <div className="mb-3">
            <span className="badge bg-info">
              {participants.length} participant
              {participants.length !== 1 ? "s" : ""} selected
            </span>
          </div>
        )}

        {/* Users List */}
        <div className="mb-4" style={{ maxHeight: "400px", overflowY: "auto" }}>
          {users.map((user) => (
            <ContactTile
              key={user.id}
              item={user}
              isSelected={participants.includes(user.id)}
              toggleSelection={toggleUserSelection}
              isGroupSelection={true}
              isAdmin={admins.includes(user.id)}
              onToggleAdmin={toggleAdminStatus}
            />
          ))}
        </div>

        {/* Submit Button */}
        <div className="d-grid">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
          >
            {id ? "Update Task" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
        <h4 className="mb-0 fw-bold">
          {currentStep === 2 && (
            <span className="text-muted fs-6 ms-2">- Step 2 of 2</span>
          )}
        </h4>
      </div>

      {currentStep === 1 ? renderStepOne() : renderStepTwo()}
    </div>
  );
};

export default CreateTaskForm;
