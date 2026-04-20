import React from "react";
import { Groups, PersonAdd, PeopleAlt } from "@mui/icons-material";
import { canManage, roleOf } from "../utils/teamUtils";

export function TeamCard({ team, currentUser, onAddMembers, onViewMembers }) {
  const manage = canManage(roleOf(currentUser));

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: "#eff6ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Groups sx={{ fontSize: 22, color: "#3b82f6" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: 600,
              color: "#0f172a",
            }}
          >
            {team.name}
          </h3>
          {team.description && (
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "0.85rem",
                color: "#64748b",
                lineHeight: 1.5,
              }}
            >
              {team.description}
            </p>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          borderTop: "1px solid #f1f5f9",
          paddingTop: 14,
        }}
      >
        <button
          onClick={() => onViewMembers(team)}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            background: "#fff",
            color: "#374151",
            fontSize: "0.85rem",
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <PeopleAlt sx={{ fontSize: 15 }} /> Members
        </button>
        {manage && (
          <button
            onClick={() => onAddMembers(team)}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: 8,
              border: "none",
              background: "#3b82f6",
              color: "#fff",
              fontSize: "0.85rem",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <PersonAdd sx={{ fontSize: 15 }} /> Add
          </button>
        )}
      </div>
    </div>
  );
}