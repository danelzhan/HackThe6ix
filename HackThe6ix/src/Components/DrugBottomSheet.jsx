import React from 'react';
import '../App.css'
import { ChevronRight, MoreHorizontal } from "lucide-react";
import '../fonts.css' 

export function DrugBottomSheet() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F4F4F4",
        display: "flex",
        alignItems: "end",
        justifyContent: "center",
        padding: "16px",
        "@media (min-width: 768px)": { padding: "0" },
      }}
    >
      {/* Medication Detail Bottom Sheet */}
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "#F4F4F4",
          borderRadius: "32px 32px 0 0",
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingTop: "24px",
          paddingBottom: "48px",
          gap: "16px",
          maxHeight: "90vh",
          overflowY: "auto",
          "@media (min-width: 768px)": {
            paddingLeft: "32px",
            paddingRight: "32px",
          },
        }}
      >
        {/* Drag Handle */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "192px",
              height: "5px",
              backgroundColor: "#B2B2B2",
              borderRadius: "4px",
            }}
          ></div>
        </div>

        {/* Content */}
        <div style={{ gap: "40px", paddingTop: "16px" }}>
          {/* Header */}
          <div style={{ gap: "8px", marginBottom: "40px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h1
                style={{
                    fontFamily: "SFT Ritam Sans TRIAL",
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#1E1E1E",
                }}
              >
                Lisdexamfetamine (Vyvanse)
              </h1>
              <MoreHorizontal
                style={{ width: "24px", height: "24px", color: "#1E1E1E" }}
              />
            </div>
            <div
              style={{
                fontFamily: "SFT Ritam Sans TRIAL",
                fontSize: "18px",
                color: "#AF6AFF",
                fontWeight: "500",
                marginTop: "8px",
              }}
            >
              June 2023 - Present
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#1E1E1E",
                fontSize: "16px",
                fontFamily: "SFT Ritam Sans TRIAL",
                marginTop: "8px",
              }}
            >
              <span>Twice daily</span>
              <span style={{ fontFamily: "SFT Ritam Sans TRIAL", fontSize: "10px" }}>●</span>
              <span>Capsule</span>
              <span style={{ fontFamily: "SFT Ritam Sans TRIAL", fontSize: "10px" }}>●</span>
              <span>40mg</span>
            </div>
          </div>

          {/* Instructions Section */}
          <div style={{ gap: "12px", marginBottom: "40px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                    fontFamily: "SFT Ritam Sans TRIAL",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1E1E1E",
                }}
              >
                Instructions
              </h2>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                  color: "#0011FF",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontFamily: "SFT Ritam Sans TRIAL", fontSize: "16px" }}>Edit Schedule</span>
                <ChevronRight
                  style={{ width: "18px", height: "18px" }}
                  strokeWidth={1.5}
                />
              </button>
            </div>
            <p
              style={{ fontFamily: "SFT Ritam Sans TRIAL", fontSize: "18px", color: "#1E1E1E", marginTop: "12px" }}
            >
              Swallow whole with food.
            </p>
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <div
                style={{
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  backgroundColor: "rgba(157, 167, 255, 0.4)",
                  borderRadius: "4px",
                  color: "#1E1E1E",
                  fontSize: "16px",
                  fontFamily: "SFT Ritam Sans TRIAL",
                }}
              >
                9:00 PM
              </div>
              <div
                style={{
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  backgroundColor: "rgba(157, 167, 255, 0.4)",
                  borderRadius: "4px",
                  color: "#1E1E1E",
                  fontSize: "16px",
                  fontFamily: "SFT Ritam Sans TRIAL",
                }}
              >
                11:00 PM
              </div>
            </div>
          </div>

          {/* Usage Considerations */}
          <div style={{ gap: "12px", marginBottom: "40px" }}>
            <h2
              style={{ fontFamily: "SFT Ritam Sans TRIAL", fontSize: "20px", fontWeight: "700", color: "#1E1E1E" }}
            >
              Usage Considerations
            </h2>
            <div style={{ gap: "4px", marginTop: "12px" }}>
              <div style={{ fontFamily: "SFT Ritam Sans TRIAL", fontSize: "18px", color: "#1E1E1E" }}>
                • Increased sensitivity to sun
              </div>
              <div
                style={{ fontFamily: "SFT Ritam Sans TRIAL", fontSize: "18px", color: "#1E1E1E", marginTop: "4px" }}
              >
                • Alcohol consumption may cause nausea
              </div>
            </div>
          </div>

          {/* Drug Interactions */}
          <div style={{ gap: "24px", marginBottom: "40px" }}>
            <div style={{ gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2
                  style={{
                    fontFamily: "SFT Ritam Sans TRIAL",
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#1E1E1E",
                  }}
                >
                  Your Drug Interactions
                </h2>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    color: "#0011FF",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>Visualize</span>
                  <ChevronRight
                    style={{ width: "18px", height: "18px" }}
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              {/* Legend */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginTop: "12px",
                  "@media (min-width: 768px)": { gap: "16px" },
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: "#FF7676",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <span style={{ fontFamily: "SFT Ritam Sans TRIAL", fontSize: "14px", color: "#7A7A7A" }}>
                    Severe
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: "#FFB476",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <span style={{ fontFamily: "SFT Ritam Sans TRIAL", fontSize: "14px", color: "#7A7A7A" }}>
                    Moderate
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: "#FFEF76",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <span style={{ fontFamily: "SFT Ritam Sans TRIAL", fontSize: "14px", color: "#7A7A7A" }}>
                    Mild
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: "#EDEDED",
                      border: "1px solid #7A7A7A",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <span style={{ fontFamily: "SFT Ritam Sans TRIAL", fontSize: "14px", color: "#7A7A7A" }}>
                    None
                  </span>
                </div>
              </div>
            </div>

            {/* Interaction List */}
            <div style={{ gap: "10px", marginTop: "24px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    backgroundColor: "#FF7676",
                    borderRadius: "50%",
                  }}
                ></div>
                <span style={{ fontFamily: "SFT Ritam Sans TRIAL", fontSize: "18px", color: "#1E1E1E" }}>
                  Sertraline (Zoloft)
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    backgroundColor: "#FFEF76",
                    borderRadius: "50%",
                  }}
                ></div>
                <span style={{ fontFamily: "SFT Ritam Sans TRIAL", fontSize: "18px", color: "#1E1E1E" }}>
                  Lisdexamfetamine (Vyvanse)
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    backgroundColor: "#FFB476",
                    borderRadius: "50%",
                  }}
                ></div>
                <span style={{ fontFamily: "SFT Ritam Sans TRIAL", fontSize: "18px", color: "#1E1E1E" }}>
                  Adderall (amphetamine/dextroamphetamine)
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    backgroundColor: "#EDEDED",
                    border: "1px solid #7A7A7A",
                    borderRadius: "50%",
                  }}
                ></div>
                <span style={{ fontFamily: "SFT Ritam Sans TRIAL", fontSize: "18px", color: "#1E1E1E" }}>
                  Melatonin
                </span>
              </div>
            </div>
          </div>

          {/* Medication Supply */}
          <div style={{ gap: "12px", marginBottom: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2
                style={{
                    fontFamily: 'SFT Ritam Sans TRIAL',
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1E1E1E",
                }}
              >
                Medication Supply
              </h2>
              <div
                style={{
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  background:
                    "linear-gradient(to right, rgba(255, 184, 184, 0.7), rgba(255, 184, 184, 0.7))",
                  border: "1.2px solid #E10000",
                  borderRadius: "20px",
                }}
              >
                <span
                  style={{
                    fontFamily: 'SFT Ritam Sans TRIAL',
                    fontSize: "12px",
                    color: "#E10000",
                    fontWeight: "500",
                    lineHeight: "10px",
                  }}
                >
                  Critical
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "32px",
                marginTop: "12px",
                "@media (min-width: 768px)": { gap: "48px" },
              }}
            >
              <div style={{ gap: "8px" }}>
                <div style={{ fontFamily: "SFT Ritam Sans TRIAL", fontSize: "16px", color: "#7A7A7A" }}>
                  Doses Until
                </div>
                <div
                  style={{
                    fontFamily: 'SFT Ritam Sans TRIAL',
                    fontSize: "16px",
                    color: "#7A7A7A",
                    marginTop: "8px",
                  }}
                >
                  Remaining supply
                </div>
                <div
                  style={{
                    fontFamily: 'SFT Ritam Sans TRIAL',
                    fontSize: "16px",
                    color: "#7A7A7A",
                    marginTop: "8px",
                  }}
                >
                  Last Refill
                </div>
                <div
                  style={{
                    fontFamily: 'SFT Ritam Sans TRIAL',
                    fontSize: "16px",
                    color: "#7A7A7A",
                    marginTop: "8px",
                  }}
                >
                  Refills Remaining
                </div>
              </div>
              <div style={{ gap: "8px" }}>
                <div style={{ fontFamily: "SFT Ritam Sans TRIAL", fontSize: "16px", color: "#1E1E1E" }}>
                  08/01/2025
                </div>
                <div
                  style={{
                    fontFamily: 'SFT Ritam Sans TRIAL',
                    fontSize: "16px",
                    color: "#1E1E1E",
                    marginTop: "8px",
                  }}
                >
                  48 capsules
                </div>
                <div
                  style={{
                    fontFamily: 'SFT Ritam Sans TRIAL',
                    fontSize: "16px",
                    color: "#1E1E1E",
                    marginTop: "8px",
                  }}
                >
                  07/18/2025
                </div>
                <div
                  style={{
                    fontFamily: 'SFT Ritam Sans TRIAL',
                    fontSize: "16px",
                    color: "#1E1E1E",
                    marginTop: "8px",
                  }}
                >
                  2
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div style={{ gap: "12px" }}>
            <h2
              style={{ fontFamily: "SFT Ritam Sans TRIAL", fontSize: "20px", fontWeight: "700", color: "#1E1E1E" }}
            >
              Notes
            </h2>
            <div
              style={{ fontFamily: "SFT Ritam Sans TRIAL", fontSize: "18px", color: "#1E1E1E", marginTop: "12px" }}
            >
              Lorem ipsum dolor sit amet.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}