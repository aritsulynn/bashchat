*** Settings *** 
Library    SeleniumLibrary 
Suite Teardown    Close Browser

*** Variables ***
${browser}    Chrome
${url}    http://localhost:3000
${test_message}    ขนมไข่ราคาเท่าไร


*** Test Cases ***
Reset Message Testing using Chrome
    Open Browser    ${url}    ${browser}
    Input Text    xpath=//input[contains(@class, "rounded-xl")]    ${test_message}
    Click Button    xpath=//button[contains(text(), "Send")]
    Wait Until Element Is Visible    xpath=(//div[contains(@class, "prose")])[last()]    timeout=10
    ${bot_response}    Get Text    xpath=(//div[contains(@class, "prose")])[last()]
    # Log    Bot's Response: ${bot_response}
    Click Button    xpath=//button[contains(text(), "Reset")]
    ${messages}    Get Element Count    xpath=//div[contains(@class, "prose")]
    Should Be Equal As Numbers    ${messages}    0
    Close Browser
