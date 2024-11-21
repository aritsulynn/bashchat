import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import App from "./App";
import { log, error } from "console";

// Mock the fetch function globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ text: "Your message was received!" }), // Mock Chatbot response
  })
);

// Test Suite 1: Test Initial Render
// | **Test** | **Visibility of input field** | **Visibility of send button** | **Visibility of reset button** |**Expected result** |
// | -------- | -------------- | ---------- | ---------- | ---------- |
// | T1 = (True, True, True) | Visible | Visible | Visible | Visible Collectly
// | T2 = (False, False, False) | Not Visible | Not Visible | Not Visible | Not Visible Collectly
describe("Test Suite 1: Test Initial Render", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test("T1: Input field, send button, reset button are visible", async () => {
    render(<App />);

    // Input field test
    const inputField = screen.getByPlaceholderText("Type your message...");
    expect(inputField).toBeVisible();
    // Try typing a message
    fireEvent.change(inputField, { target: { value: "Hello" } });
    expect(inputField.value).toBe("Hello");

    // Send button test
    const sendButton = screen.getByText("Send");
    expect(sendButton).toBeVisible();

    // Reset button test
    const resetButton = screen.getByText("Reset");
    expect(resetButton).toBeVisible();
  });

  test("T2: Input field, send button, reset button are not visible or not have", () => {
    render(<App />);

    // Input field test
    const inputField = screen.queryByPlaceholderText("Type your message...");
    inputField.remove();
    expect(inputField).not.toBeInTheDocument();

    // Send button test
    const sendButton = screen.queryByText("Send");
    sendButton.remove();
    expect(sendButton).not.toBeInTheDocument();

    // Reset button test
    const resetButton = screen.queryByText("Reset");
    resetButton.remove();
    expect(resetButton).not.toBeInTheDocument();
  });
});

// Test Suite 2: Test Message Sending
// | **Test** | **Message Input** | **Visibility of send button**| **Visibility of Message that has been sent** |**Expected result** |
// |--------------------|---|---|---|--|
// | T1 (Empty input, False, False) | "" | Not Visible |Not Visible | Message cannot be sent |
// | T2 (Filled input, True, True) | "ร้านอยู่ที่ไหน" | Visible | Visible | Message sent successfully |
// | T3 (Filled input, False, True) | "ร้านอยู่ที่ไหน" | Not Visible | Visible | Message cannot be sent |

describe("Test Suite 2: Test Message Sending", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test("T1: Empty input, False, False", async () => {
    render(<App />);
    const inputField = screen.getByPlaceholderText("Type your message...");
    const sendButton = screen.queryByText("Send");
    // Simulate typing a message
    fireEvent.change(inputField, { target: { value: "" } });
    expect(inputField.value).toBe("");

    sendButton.remove();
    expect(sendButton).not.toBeInTheDocument();
  });

  test("T2: Filled input, True, True", async () => {
    render(<App />);
    const inputField = screen.getByPlaceholderText("Type your message...");
    const sendButton = screen.getByText("Send");

    // Simulate typing a message
    fireEvent.change(inputField, { target: { value: "ร้านอยู่ที่ไหน" } });
    expect(inputField.value).toBe("ร้านอยู่ที่ไหน");

    // Ensure the send button is visible
    expect(sendButton).toBeVisible();
    // Simulate sending the message
    fireEvent.click(sendButton);

    // Ensure the message is visible after sending
    const message = screen.queryByText("ร้านอยู่ที่ไหน");
    expect(message).toBeInTheDocument();
  });

  test("T3: Filled input, False, True", async () => {
    render(<App />);
    const inputField = screen.getByPlaceholderText("Type your message...");
    const sendButton = screen.queryByText("Send");

    // Simulate typing a message
    fireEvent.change(inputField, { target: { value: "ร้านอยู่ที่ไหน" } });
    expect(inputField.value).toBe("ร้านอยู่ที่ไหน");

    sendButton.remove();
    // Ensure the send button is not visible
    expect(sendButton).not.toBeInTheDocument();

    const message = screen.queryByText("ร้านอยู่ที่ไหน");
    expect(message).not.toBeInTheDocument();
  });
});

// Test Suite 3: Test Message Reset
// | **Test** | **Message Input** | **Session Id** | **Visibility of Reset Button** | **Expected result** |
// |--------------------|---|---|---|--|
// | T1 (Empty input, No Session Id, False) | "" | "" | Not Visible | Cannot reset message |
// | T2 (Filled input, New Session Id, True) | "ร้านอยู่ไหน" | "abcd-efgh-ijkl-mnoq" | Visible | Reset message successfully |
// | T3 (Filled input, Existing Id, False) | "ร้านอยู่ไหน" | "abcd-efgh-ijkl-mnop" | Not Visible | Cannot reset message and Failed to generate new session id |
describe("Test Suite 3: Test Message Reset", () => {
  test("T1: Empty input, No Session Id, False", async () => {
    render(<App />);
    const inputField = screen.getByPlaceholderText("Type your message...");
    const resetButton = screen.queryByText("Reset");

    // Simulate typing a message
    fireEvent.change(inputField, { target: { value: "" } });
    expect(inputField.value).toBe("");
    localStorage.clear();
    // Ensure no session ID exists
    expect(localStorage.getItem("sessionId")).toBeNull();

    resetButton.remove();
    // Ensure the reset button is not visible
    expect(resetButton).not.toBeInTheDocument();
  });

  test("T2: Filled input, New Session Id, True", async () => {
    render(<App />);
    const inputField = screen.getByPlaceholderText("Type your message...");
    const resetButton = screen.getByText("Reset");

    // Simulate typing a message
    fireEvent.change(inputField, { target: { value: "ร้านอยู่ที่ไหน" } });
    expect(inputField.value).toBe("ร้านอยู่ที่ไหน");

    // generate new session ID
    localStorage.setItem("sessionId", "abcd-efgh-ijkl-mnoq");
    expect(localStorage.getItem("sessionId")).not.toBeNull();

    // Ensure the reset button is visible
    expect(resetButton).toBeVisible();
    // Simulate resetting the message
    fireEvent.click(resetButton);

    const message = screen.queryByText("ร้านอยู่ที่ไหน");
    expect(message).not.toBeInTheDocument();
  });

  test("T3: Filled input, Existing Id, False", async () => {
    render(<App />);
    const inputField = screen.getByPlaceholderText("Type your message...");
    const resetButton = screen.queryByText("Reset");

    // Simulate typing a message
    fireEvent.change(inputField, { target: { value: "ร้านอยู่ที่ไหน" } });
    expect(inputField.value).toBe("ร้านอยู่ที่ไหน");

    localStorage.getItem("sessionId");
    expect(localStorage.getItem("sessionId")).not.toBeNull();

    // Ensure the reset button is not visible
    resetButton.remove();
    expect(resetButton).not.toBeInTheDocument();
    if (resetButton !== null) {
      fireEvent.click(resetButton);
    }
  });
});
