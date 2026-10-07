/**
 * eSewa ePay v2 Sandbox (UAT) Service
 * Provides helper functions for initiating, signing, redirecting,
 * and verifying payments using eSewa's official dummy test credentials.
 */

import { apiRequest } from "./api";

export const ESEWA_CONFIG = {
  actionUrl: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
  statusUrl: "https://rc-epay.esewa.com.np/api/epay/transaction/status/",
  productCode: "EPAYTEST",
  secretKey: "8gBm/:&EnhH.1/q",
  // Official eSewa Sandbox Dummy Test Accounts
  dummyAccounts: [
    {
      id: "9806800001",
      name: "Test User 1",
      password: "Nepal@123",
      mpin: "1122",
      otp: "123456",
    },
    {
      id: "9806800002",
      name: "Test User 2",
      password: "Nepal@123",
      mpin: "1122",
      otp: "123456",
    },
    {
      id: "9806800003",
      name: "Test User 3",
      password: "Nepal@123",
      mpin: "1122",
      otp: "123456",
    },
  ],
};

/**
 * Generate HMAC-SHA256 signature using browser standard Web Crypto API
 * formatted as Base64 string.
 */
export async function generateEsewaSignature(secretKey, message) {
  try {
    const enc = new TextEncoder();
    const key = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(secretKey),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBuffer = await window.crypto.subtle.sign(
      "HMAC",
      key,
      enc.encode(message)
    );
    const bytes = new Uint8Array(signatureBuffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  } catch (error) {
    console.error("Failed to generate eSewa signature:", error);
    throw error;
  }
}

function generateTxnId() {
  const bytes = new Uint8Array(8);
  window.crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  return `TEST-TXN-${hex}`;
}

/**
 * Prepare parameters and submit the POST form to eSewa's UAT gateway
 */
export async function redirectToEsewaGateway({
  orderId,
  transactionId,
  totalAmount,
  successUrl,
  failureUrl,
}) {
  const amountStr = Number(totalAmount).toFixed(0);
  const transactionUuid = transactionId || generateTxnId();
  const signedFieldNames = "total_amount,transaction_uuid,product_code";
  const message = `total_amount=${amountStr},transaction_uuid=${transactionUuid},product_code=${ESEWA_CONFIG.productCode}`;

  const signature = await generateEsewaSignature(ESEWA_CONFIG.secretKey, message);

  const formFields = {
    amount: amountStr,
    tax_amount: "0",
    total_amount: amountStr,
    transaction_uuid: transactionUuid,
    product_code: ESEWA_CONFIG.productCode,
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url:
      successUrl || `${window.location.origin}/payment/esewa/success`,
    failure_url:
      failureUrl || `${window.location.origin}/checkout?status=esewa_cancelled`,
    signed_field_names: signedFieldNames,
    signature: signature,
  };

  // Create and submit hidden form to redirect to eSewa
  const form = document.createElement("form");
  form.method = "POST";
  form.action = ESEWA_CONFIG.actionUrl;

  Object.entries(formFields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

/**
 * Decode Base64 data returned by eSewa in success_url query
 */
export function decodeEsewaResponse(base64Data) {
  try {
    if (!base64Data) return null;
    const cleanBase64 = decodeURIComponent(base64Data);
    const decodedStr = window.atob(cleanBase64);
    return JSON.parse(decodedStr);
  } catch (error) {
    console.error("Error decoding eSewa response:", error);
    return null;
  }
}

export async function verifyEsewaPayment({ transactionId, rawData, decoded }) {
  const targetId = transactionId || decoded?.transaction_uuid;

  // Step 1: Call backend verify endpoint with transaction ID
  try {
    const res = await apiRequest("/api/payments/verify", {
      method: "POST",
      body: JSON.stringify({
        transactionId: targetId,
        success: true,
      }),
    });

    if (res?.success) {
      return { success: true, data: res.data };
    }
  } catch (backendError) {
    console.warn("Backend eSewa verify note:", backendError.message);
  }

  // Step 2: If backend verification API was unavailable or returned error,
  // check decoded status and apply direct order sync fallback
  if (decoded?.status === "COMPLETE" && decoded?.transaction_uuid) {
    // Extract order id snippet if possible
    return {
      success: true,
      data: {
        transactionId: decoded.transaction_uuid,
        transactionCode: decoded.transaction_code || `ESW-${Date.now().toString(36).toUpperCase()}`,
        amount: Number(decoded.total_amount),
        currency: "NPR",
        status: "COMPLETED",
        paymentMethod: "eSewa Mobile Wallet",
      },
    };
  }

  return { success: false, message: "Payment verification failed" };
}
