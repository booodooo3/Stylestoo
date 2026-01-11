import React from 'react';
import { useUser } from "@clerk/clerk-react";

export default function CreditDisplay() { 
  const { user, isLoaded } = useUser(); 

  // انتظار تحميل البيانات 
  if (!isLoaded) return null; 

  // إذا لم يكن المستخدم مسجلاً للدخول، لا تظهر شيئاً 
  if (!user) return null; 

  // قراءة الرصيد من البيانات (إذا لم يوجد، نعتبره 3) 
  const credits = (user.publicMetadata.credits as number) ?? 3; 

  return ( 
    <div style={styles.container}> 
      <span style={styles.text}> 
        💰 الرصيد المتبقي: <strong>{credits}</strong> 
      </span> 
      {credits === 0 && ( 
        <button style={styles.buyButton} onClick={() => alert("سيتم نقلك لصفحة الدفع قريباً!")}> 
          شحن الرصيد (+) 
        </button> 
      )} 
    </div> 
  ); 
} 

// تنسيق بسيط (CSS) 
const styles = { 
  container: { 
    padding: "10px 20px", 
    backgroundColor: "#f0fdf4", 
    border: "1px solid #bbf7d0", 
    borderRadius: "8px", 
    display: "inline-flex", 
    alignItems: "center", 
    gap: "10px", 
    margin: "10px 0", 
    color: "#166534", 
  } as React.CSSProperties, 
  text: { 
    fontSize: "16px", 
  } as React.CSSProperties, 
  buyButton: { 
    backgroundColor: "#16a34a", 
    color: "white", 
    border: "none", 
    padding: "5px 10px", 
    borderRadius: "5px", 
    cursor: "pointer", 
    fontSize: "14px", 
  } as React.CSSProperties 
};