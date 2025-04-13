import {
  Avatar,
  List,
  Modal,
  AutoComplete,
  Spin,
  Button,
  Popconfirm,
} from "antd";
import useNotify from "../../Context/notificationContext";
import stringToColor from "../../utils/stringToColor";
import debounce from "lodash.debounce";
import {
  inviteMember,
  removeMember,
  searchUsers,
} from "../../Services/boardService";
import { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { useBoardData } from "../../Context/boardContext";

export default function InviteMembers({ open, setOpen }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { boardMembers, getBoardMembers, boardID } = useBoardData();
  const { notify } = useNotify();

  const fetchUsers = debounce(async (searchText) => {
    if (!searchText) return;

    setLoading(true);
    try {
      const data = await searchUsers(searchText);
      setOptions(
        data.data.data.map((user) => ({
          value: user.email,
          label: (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Avatar
                size="large"
                style={{
                  backgroundColor: stringToColor(user.name),
                  color: "white",
                  minWidth: "40px",
                }}
              >
                {user.name.substring(0, 4)}
              </Avatar>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <strong style={{ margin: 0 }}>{user.name}</strong>
                <small style={{ margin: 0 }}>{user.email}</small>
              </div>
            </div>
          ),
          disabled: boardMembers.find(
            (member) => member.member_email == user.email
          )
            ? true
            : false,
        }))
      );
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, 400);

  const onSelect = (email) => {
    console.log(email);
    inviteMember(boardID, { email })
      .then((res) => {
        getBoardMembers();
        setOptions([]);
        notify("success", "Done", "Member added successfully!");
      })
      .catch(() => {
        notify("error", "Error", `Failed to invite ${email} to the Board!`);
      });
  };

  const handleRemove = (email) => {
    removeMember(boardID, email)
      .then((res) => {
        getBoardMembers();
        notify("success", "Done", "Member Removed successfully!");
      })
      .catch(() => {
        notify("error", "Error", `Failed to remove ${email} of the Board!`);
      });
  };

  return (
    <Modal
      title={<h1 style={{ margin: 0 }}>Board Members</h1>}
      open={open}
      okText="Create"
      cancelText="Cancel"
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      <AutoComplete
        style={{ width: "100%" }}
        onSearch={fetchUsers}
        onSelect={onSelect}
        options={options}
        notFoundContent={loading ? <Spin size="small" /> : "Nenhum resultado"}
        placeholder="Search by Name or Email"
      />
      <hr />
      <List
        pagination={{ pageSize: 4, pagination: "top", align: "start" }}
        dataSource={boardMembers}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Popconfirm
                title="Remove this member"
                description="Are you sure you want to remove this Member?"
                onConfirm={() => handleRemove(item.member_email)}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
                placement="bottom"
              >
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  iconPosition="end"
                >
                  Remove
                </Button>
                ,
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  style={{
                    backgroundColor: stringToColor(item.member_name),
                    color: "white",
                  }}
                >
                  {item.member_name.substring(0, 4)}
                </Avatar>
              }
              title={item.member_name}
              description={item.member_email}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
}
