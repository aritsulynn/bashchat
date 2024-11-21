*** Settings *** 
Library    SeleniumLibrary 
Suite Teardown    Close Browser

*** Variables ***
${browser}    Chrome
${url}    http://localhost:3000
${test_message}    ขนมไข่ราคาเท่าไร
${starting_prompt}    ร้านอยู่ไหน

*** Test Cases ***
Test Chatbot Interaction Testing using Chrome
    # Chatbot Interaction Testing
    # First, open the browser and go to the chatbot website
    # Then, input the test message and click the send button
    # Wait for the bot's response to appear
    # Get the bot's response for checking the bot is working correctly
    # Finally, close the browser
    Open Browser    ${url}    ${browser}
    Input Text    xpath=//input[contains(@class, "rounded-xl")]    ${test_message}
    Click Button    xpath=//button[contains(text(), "Send")]
    Wait Until Element Is Visible    xpath=(//div[contains(@class, "prose")])[last()]    timeout=10
    ${bot_response}    Get Text    xpath=(//div[contains(@class, "prose")])[last()]
    Log    Bot's Response: ${bot_response}
    Close Browser
Reset Message Testing using Chrome
    # Reset Message Testing
    # First, open the browser and go to the chatbot website
    # Then, input the test message and click the send button
    # Wait for the bot's response to appear
    # Get the bot's response for checking the bot is working correctly
    # Click the reset button to clear the chat history
    # Get the number of messages to check the chat history is cleared for checking the reset button is working correctly
    # Finally, close the browser
    Open Browser    ${url}    ${browser}
    Input Text    xpath=//input[contains(@class, "rounded-xl")]    ${test_message}
    Click Button    xpath=//button[contains(text(), "Send")]
    Wait Until Element Is Visible    xpath=(//div[contains(@class, "prose")])[last()]    timeout=10
    ${bot_response}    Get Text    xpath=(//div[contains(@class, "prose")])[last()]
    Log    Bot's Response: ${bot_response}
    Click Button    xpath=//button[contains(text(), "Reset")]
    ${messages}    Get Element Count    xpath=//div[contains(@class, "prose")]
    Should Be Equal As Numbers    ${messages}    0
    Close Browser
Starting Prompt Testing using Chrome
    # Starting Prompt Testing
    # First, open the browser and go to the chatbot website
    # Then, get the number of prompts to check the starting prompt ("น้ำส้มราคาเท่าไร", "ร้านเปิดกี่โมง", "ร้านอยู่ไหน") is displayed correctly
    # Click the starting prompt button
    # Click the send button
    # Wait for the bot's response to appear
    # Get the bot's response for checking the bot is working correctly
    # Get the number of prompts to check the starting prompt is hidden
    # Finally, close the browser
    Open Browser    ${url}    ${browser}
    ${prompts_visible}    Get Element Count    xpath=//button[contains(@class, "bg-gray-200")]
    Should Be Equal As Numbers    ${prompts_visible}    3
    Click Button    xpath=//button[contains(text(), "${starting_prompt}")]
    Click Button    xpath=//button[contains(text(), "Send")]
    Wait Until Element Is Visible    xpath=(//div[contains(@class, "prose")])[last()]    timeout=10
    ${bot_response}    Get Text    xpath=(//div[contains(@class, "prose")])[last()]
    Log    Bot's Response: ${bot_response}
    ${prompts_visible}    Get Element Count    xpath=//button[contains(@class, "bg-gray-200")]
    Should Be Equal As Numbers    ${prompts_visible}    0
    Close Browser