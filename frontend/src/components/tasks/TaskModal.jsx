import { useState } from "react";
import { uid } from "../../data/helpers.js";
import Modal from "../ui/Modal.jsx";
import Btn from "../ui/Btn.jsx";
import { Input, Textarea, Select } from "../ui/FormFields.jsx";
import { Spinner } from "../ui/Badges.jsx";
import AssigneePicker from "../ui/AssigneePicker.jsx";

export default function TaskModal({ task, onSave, onClose, currentUser, users, toast }) {
  const isEdit = !!task;
  const [form, setForm] = useState(task ?? {
    title:"", description:"", priority:"medium", status:"todo",
    assignees:[], dueDate:"", tags:"",
  });
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);

  const set  = k => v => setForm(p => ({...p, [k]: v}));
  const setE = k => e => set(k)(e.target.value);

  const validate = () => {
    const e = {};
    if (!form.title.trim())    e.title = "Title is required";
    if (form.title.length > 200) e.title = "Title must be 200 chars or less";
    return e;
  };

  const save = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    const tagsArr = typeof form.tags === "string"
      ? form.tags.split(",").map(t => t.trim()).filter(Boolean)
      : form.tags;
    await onSave({
      ...form,
      tags:          tagsArr,
      id:            task?.id ?? "t" + uid(),
      createdAt:     task?.createdAt ?? new Date().toISOString().split("T")[0],
      commentCount:  task?.commentCount  ?? 0,
      attachmentCount: task?.attachmentCount ?? 0,
      createdBy:     task?.createdBy ?? currentUser?.uid,
    });
    toast.show(isEdit ? "Task updated" : "Task created", "success");
    setSaving(false);
    onClose();
  };

  return (
    <Modal
      title={isEdit ? "Edit task" : "New task"}
      sub={isEdit ? "Update task details and assignees" : "Fill in the details and assign to team members"}
      onClose={onClose}
      wide
      footer={<>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={save} disabled={saving} icon={saving ? "ti-loader-2" : isEdit ? "ti-device-floppy" : "ti-plus"}>
          {saving ? <><Spinner size={14} /> Saving…</> : isEdit ? "Save changes" : "Create task"}
        </Btn>
      </>}
    >
      <Input label="Task title *" id="title" value={form.title} onChange={setE("title")} placeholder="What needs to be done?" error={errors.title} autoFocus />
      <Textarea label="Description" id="desc" value={form.description} onChange={setE("description")} placeholder="Add context, requirements, or notes…" rows={3} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        <Select label="Priority" id="priority" value={form.priority} onChange={setE("priority")}>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </Select>
        <Select label="Status" id="status" value={form.status} onChange={setE("status")}>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </Select>
        <div style={{marginBottom:14}}>
          <label htmlFor="due" style={{display:"block",fontSize:13,fontWeight:500,color:"#334155",marginBottom:5}}>Due date</label>
          <input type="date" id="due" value={form.dueDate} onChange={setE("dueDate")} />
        </div>
      </div>
      <Input label="Tags" id="tags" value={typeof form.tags === "string" ? form.tags : (form.tags ?? []).join(",")} onChange={setE("tags")} placeholder="backend, api, design  (comma-separated)" />
      <AssigneePicker value={form.assignees} onChange={set("assignees")} currentUser={currentUser} users={users} />
    </Modal>
  );
}
