import { useState } from "react";
import { uid } from "../../data/helpers.js";
import Modal from "../ui/Modal.jsx";
import Btn from "../ui/Btn.jsx";
import { Input, Textarea, Select } from "../ui/FormFields.jsx";
import { Spinner } from "../ui/Badges.jsx";
import AssigneePicker from "../ui/AssigneePicker.jsx";

const LABEL_CHIPS = [
  { value:"Work",      color:"#4F46E5", bg:"#EEF2FF" },
  { value:"Personal",  color:"#7C3AED", bg:"#F5F3FF" },
  { value:"Urgent",    color:"#E11D48", bg:"#FFF1F2" },
  { value:"Design",    color:"#D97706", bg:"#FFFBEB" },
  { value:"Development",color:"#0284C7", bg:"#F0F9FF" },
  { value:"Meeting",   color:"#059669", bg:"#ECFDF5" },
];

export default function TaskModal({ task, onSave, onClose, currentUser, users, toast }) {
  const isEdit = !!task;
  const initialTags = task
    ? (Array.isArray(task.tags) ? task.tags : (task.tags ?? "").split(",").map(t => t.trim()).filter(Boolean))
    : [];
  const [form, setForm] = useState(task ?? {
    title:"", description:"", priority:"medium", status:"todo",
    assignees:[currentUser?.uid].filter(Boolean), dueDate:"", tags: initialTags,
  });
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);

  const set  = k => v => setForm(p => ({...p, [k]: v}));
  const setE = k => e => set(k)(e.target.value);

  const toggleLabel = label => {
    setForm(p => {
      const current = Array.isArray(p.tags) ? p.tags : (p.tags ?? "").split(",").map(t => t.trim()).filter(Boolean);
      const next = current.includes(label) ? current.filter(t => t !== label) : [...current, label];
      return { ...p, tags: next };
    });
  };

  const currentTags = Array.isArray(form.tags) ? form.tags : (form.tags ?? "").split(",").map(t => t.trim()).filter(Boolean);

  const validate = () => {
    const e = {};
    if (!form.title.trim())    e.title = "Title is required";
    if (form.title.length > 200) e.title = "Title must be 200 chars or less";
    if (!form.dueDate) e.dueDate = "Due date is required";
    return e;
  };

  const save = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    const tagsArr = Array.isArray(form.tags)
      ? form.tags
      : (form.tags ?? "").split(",").map(t => t.trim()).filter(Boolean);
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
        <div style={{flex:1}} />
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
          <label htmlFor="due" style={{display:"block",fontSize:13,fontWeight:500,color:"#334155",marginBottom:5}}>Due date *</label>
          <input type="date" id="due" value={form.dueDate} onChange={setE("dueDate")} max="2099-12-31" style={{borderColor:errors.dueDate ? "#F43F5E" : undefined}} />
          {errors.dueDate && <p style={{fontSize:12,color:"#E11D48",marginTop:4}}>{errors.dueDate}</p>}
        </div>
      </div>
      <div style={{marginBottom:14}}>
        <label style={{display:"block",fontSize:13,fontWeight:500,color:"#334155",marginBottom:6}}>Labels</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {LABEL_CHIPS.map(chip => {
            const active = currentTags.includes(chip.value);
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => toggleLabel(chip.value)}
                style={{fontSize:12,fontWeight:500,padding:"5px 12px",borderRadius:20,border:`1.5px solid ${active ? chip.color : "#E2E8F0"}`,background:active ? chip.bg : "#fff",color:active ? chip.color : "#64748B",cursor:"pointer",transition:"all .12s"}}
              >
                {active && <i className="ti ti-check" style={{fontSize:11,marginRight:3}} aria-hidden="true" />}
                {chip.value}
              </button>
            );
          })}
        </div>
      </div>
      <AssigneePicker value={form.assignees} onChange={set("assignees")} currentUser={currentUser} users={users} />
    </Modal>
  );
}
