*** Settings *** 
Library    SeleniumLibrary 
Suite Teardown    Close Browser

*** Variables ***
${browser}    Chrome
${url}    http://localhost:3000
${test_message}    ขนมไข่ราคาเท่าไร


*** Test Cases ***
Test Chatbot Interaction Testing using Chrome
    Open Browser    ${url}    ${browser}
    Input Text    xpath=//input[contains(@class, "rounded-xl")]    ${test_message}
    Click Button    xpath=//button[contains(text(), "Send")]
    Wait Until Element Is Visible    xpath=(//div[contains(@class, "prose")])[last()]    timeout=10
    ${bot_response}    Get Text    xpath=(//div[contains(@class, "prose")])[last()]
    Log    Bot's Response: ${bot_response}
    Close Browser

