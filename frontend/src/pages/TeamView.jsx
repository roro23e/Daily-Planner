import { useState } from "react";
import { USERS, PRIORITY_CFG } from "../data/constants.js";
import Btn from "../components/ui/Btn.jsx";
import Modal from "../components/ui/Modal.jsx";
import { AvatarStack } from "../components/ui/Avatar.jsx";
import GroupModal    from "../components/team/GroupModal.jsx";
import GroupTaskModal from "../components/team/GroupTaskModal.jsx";
import GroupDetailPanel from "../components/team/GroupDetailPanel.jsx";

export default function TeamView({ tasks, groups, users = USERS, onSaveGroup, onDeleteGroup, currentUser, onSaveTask, toast, onViewTask, onStatusChange }) {
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showGroupModal,  setShowGroupModal]  = useState(false);
  const [editingGroup,    setEditingGroup]    = useState(null);
  const [assignTarget,    setAssignTarget]    = useState(null);
  const [deleteGroupId,   setDeleteGroupId]   = useState(null);
  const [memberQ,         setMemberQ]         = useState("");

  const selectedGroup = groups.find(g => g.id === selectedGroupId) ?? null;
  const canManageGroups = currentUser?.role === "admin" || currentUser?.role === "manager";

  const saveGroup = async g => {
    const saved = await onSaveGroup(g);
    setSelectedGroupId(saved.id);
    toast.show(editingGroup ? "Group updated" : "Group created", "success");
    setEditingGroup(null);
  };

  const deleteGroup = async id => {
    await onDeleteGroup(id);
    if (selectedGroupId === id) setSelectedGroupId(null);
    toast.show("Group deleted", "success");
    setDeleteGroupId(null);
  };

  return (
    <div className="anim-fade" style={{display:"flex",gap:18,height:"100%",overflow:"hidden"}}>

      {/* ── Left: group list ── */}
      <div style={{width:260,flexShrink:0,display:"flex",flexDirection:"column",gap:10,overflowY:"auto"}}>
        {canManageGroups && (
          <Btn full icon="ti-users-plus" onClick={() => { setEditingGroup(null); setShowGroupModal(true); }}>
            New group
          </Btn>
        )}

        {/* All members */}
        <div
          onClick={() => setSelectedGroupId(null)}
          style={{background:selectedGroupId===null?"#EEF2FF":"#fff",border:`1.5px solid ${selectedGroupId===null?"#4F46E5":"#E2E8F0"}`,borderRadius:10,padding:"12px 14px",cursor:"pointer"}}
        >
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8}}>
            <div style={{width:30,height:30,borderRadius:8,background:"#EEF2FF",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <i className="ti ti-world" style={{fontSize:15,color:"#4F46E5"}} aria-hidden="true" />
            </div>
            <span style={{fontSize:13,fontWeight:600,color:selectedGroupId===null?"#4F46E5":"#0F172A"}}>All members</span>
          </div>
          <AvatarStack uids={users.map(u => u.uid)} max={5} />
          <p style={{fontSize:11,color:"#94A3B8",marginTop:6}}>{users.length} people · {tasks.length} total tasks</p>
        </div>

        {/* Groups */}
        {groups.map(g => {
          const gTasks = tasks.filter(t => t.groupId === g.id);
          const active = gTasks.filter(t => t.status !== "done").length;
          const sel    = selectedGroupId === g.id;
          return (
            <div
              key={g.id}
              onClick={() => setSelectedGroupId(g.id)}
              style={{background:sel?g.color+"10":"#fff",border:`1.5px solid ${sel?g.color:"#E2E8F0"}`,borderRadius:10,padding:"12px 14px",cursor:"pointer",transition:"border-color .15s,background .15s"}}
            >
              <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8}}>
                <div style={{width:30,height:30,borderRadius:8,background:g.color+"20",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <i className="ti ti-users" style={{fontSize:15,color:g.color}} aria-hidden="true" />
                </div>
                <span style={{fontSize:13,fontWeight:600,color:sel?g.color:"#0F172A",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.name}</span>
              </div>
              <AvatarStack uids={g.memberIds} max={4} />
              <div style={{display:"flex",justifyContent:"space-between",marginTop:7}}>
                <span style={{fontSize:11,color:"#94A3B8"}}>{g.memberIds.length} member{g.memberIds.length !== 1 ? "s" : ""}</span>
                <span style={{fontSize:11,color:sel?g.color:"#94A3B8",fontWeight:500}}>{active} active task{active !== 1 ? "s" : ""}</span>
              </div>
            </div>
          );
        })}

        {groups.length === 0 && !canManageGroups && (
          <div style={{textAlign:"center",padding:"32px 16px",color:"#94A3B8",fontSize:13}}>
            <i className="ti ti-users" style={{fontSize:32,display:"block",marginBottom:8}} aria-hidden="true" />
            No groups yet
          </div>
        )}
      </div>

      {/* ── Right: detail / all-members view ── */}
      <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {selectedGroup ? (
          <GroupDetailPanel
            group={selectedGroup}
            tasks={tasks}
            onClose={() => setSelectedGroupId(null)}
            onEditGroup={g => { setEditingGroup(g); setShowGroupModal(true); }}
            onDeleteGroup={id => setDeleteGroupId(id)}
            onAssignTask={g => setAssignTarget(g)}
            onStatusChange={onStatusChange}
            onViewTask={onViewTask}
            currentUser={currentUser}
            users={users}
            toast={toast}
          />
        ) : (
          /* All-members overview */
          <div className="anim-fade" style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:14,flex:1,overflowY:"auto",padding:"20px 24px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <h2 style={{fontSize:17,fontWeight:700,color:"#0F172A"}}>All team members</h2>
              <div style={{position:"relative",maxWidth:240}}>
                <i className="ti ti-search" aria-hidden="true" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#94A3B8",fontSize:13}} />
                <input value={memberQ} onChange={e => setMemberQ(e.target.value)} placeholder="Search members…" style={{paddingLeft:30,height:32,fontSize:13}} />
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:14}}>
              {users
                .filter(u => !memberQ || u.name.toLowerCase().includes(memberQ.toLowerCase()) || u.email.toLowerCase().includes(memberQ.toLowerCase()))
                .map(u => {
                  const uTasks  = tasks.filter(t => t.assignees.includes(u.uid));
                  const active  = uTasks.filter(t => t.status !== "done");
                  const doneArr = uTasks.filter(t => t.status === "done");
                  const uGroups = groups.filter(g => g.memberIds.includes(u.uid));
                  return (
                    <div key={u.uid} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:12,padding:16}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                        <div style={{width:40,height:40,borderRadius:"50%",background:u.color+"20",border:`2px solid ${u.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:u.color,flexShrink:0}}>{u.initials}</div>
                        <div style={{minWidth:0}}>
                          <p style={{fontSize:13,fontWeight:600,color:"#0F172A",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.name}</p>
                          <p style={{fontSize:11,color:"#94A3B8"}}>{u.role}</p>
                        </div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                        {[["Active",active.length,"#EEF2FF","#4F46E5"],["Done",doneArr.length,"#ECFDF5","#059669"]].map(([l,v,bg,c]) => (
                          <div key={l} style={{background:bg,borderRadius:7,padding:"7px 10px",textAlign:"center"}}>
                            <p style={{fontSize:18,fontWeight:700,color:c}}>{v}</p>
                            <p style={{fontSize:10,color:c+"bb"}}>{l}</p>
                          </div>
                        ))}
                      </div>
                      {uGroups.length > 0 && (
                        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>
                          {uGroups.map(g => (
                            <span key={g.id} onClick={() => setSelectedGroupId(g.id)} style={{fontSize:10,fontWeight:500,padding:"2px 7px",borderRadius:4,background:g.color+"15",color:g.color,border:`1px solid ${g.color}25`,cursor:"pointer"}}>{g.name}</span>
                          ))}
                        </div>
                      )}
                      {active.slice(0, 2).map(t => (
                        <div key={t.id} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 0",borderTop:"1px solid #E2E8F0",marginTop:4}}>
                          <div style={{width:5,height:5,borderRadius:"50%",background:PRIORITY_CFG[t.priority].dot,flexShrink:0}} />
                          <span style={{fontSize:11,color:"#334155",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{t.title}</span>
                        </div>
                      ))}
                    </div>
                  );
                })
              }
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {showGroupModal && (
        <GroupModal
          group={editingGroup}
          onSave={saveGroup}
          onClose={() => { setShowGroupModal(false); setEditingGroup(null); }}
          currentUser={currentUser}
          users={users}
        />
      )}
      {assignTarget && (
        <GroupTaskModal
          group={assignTarget}
          onSave={onSaveTask}
          onClose={() => setAssignTarget(null)}
          currentUser={currentUser}
          users={users}
          toast={toast}
        />
      )}
      {deleteGroupId && (
        <Modal
          title="Delete group"
          sub="This cannot be undone."
          onClose={() => setDeleteGroupId(null)}
          footer={<>
            <Btn variant="secondary" onClick={() => setDeleteGroupId(null)}>Cancel</Btn>
            <Btn variant="danger" icon="ti-trash" onClick={() => deleteGroup(deleteGroupId)}>Delete group</Btn>
          </>}
        >
          <p style={{fontSize:14,color:"#64748B",lineHeight:1.6}}>
            Deleting this group will not delete its tasks, but tasks will lose their group association.
          </p>
        </Modal>
      )}
    </div>
  );
}
