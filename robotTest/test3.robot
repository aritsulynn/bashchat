*** Settings *** 
Library    SeleniumLibrary 
Suite Teardown    Close Browser

*** Variables ***
${browser}    Chrome
${url}    http://localhost:3000
${starting_prompt}    ร้านอยู่ไหน

*** Test Cases ***
Starting Prompt Testing using Chrome
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
