import React from "react";
import { SingleVideoResponse } from "../../../types/video.types";
import Modal from "../../../components/ui/modals";
import { formatSeconds, groupByDateAndUser } from "../../../utils/helper";

type DatasetModalProps = {
  data: SingleVideoResponse["videoViewDurations"];
  show: boolean;
  onClose: () => void;
};

const DurationsModal: React.FC<DatasetModalProps> = ({
  data,
  show,
  onClose,
}) => {
  const durations = groupByDateAndUser(data);
  return (
    <Modal isOpen={show} title="Viewers" onClose={onClose}>
      <div className="table-responsive">
        <table className="table table-bordered rounded table-striped">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Duration (s)</th>
              <th>Viewed On</th>
            </tr>
          </thead>
          <tbody>
            {durations.length > 0 ? (
              durations.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.user.name}</td>
                  <td>{formatSeconds(item.durationInSec)}</td>
                  <td>{new Date(item.createdOn).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default DurationsModal;
