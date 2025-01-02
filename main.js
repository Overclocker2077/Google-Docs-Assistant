function onOpen() {
  var ui = DocumentApp.getUi();
  ui.createMenu("200 IQ Assistant")
    .addItem("Write", "read_write")
    .addSeparator()
    .addItem("Feed Back", "feedBack")
    .addSeparator()
    .addItem("Enhance Writing", "Enhancement")
    .addToUi();
}

function read_write() {
  // var prompt = DocumentApp.getActiveDocument().getBody().getText();
  var prompt = get_selected();
  const resp = fetch_OpenaiAPI_gpt4(prompt.getText()).choices[0].message.content;
  replace_selected(resp);
  // DocumentApp.getUi().alert(prompt);
  

  // var output = fetch_OpenaiAPI_gpt4("Hello World!!");
  // DocumentApp.getUi().alert(output.choices[0].message.content);
}

function Enhancement() {
    var ui = DocumentApp.getUi();
    var prompt = ui.prompt("Prompt", "Enter prompt: ");
  
}


function feedBack() {
  
}

// get text highlighted/selected by the user 
function get_selected() {
  var prompt = "";
  const selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    selection.getRangeElements().forEach(element => {
      prompt = element.getElement().asText();
    });
  }
  return prompt;
}

function replace_selected(new_text) {
  const selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    selection.getRangeElements().forEach(element => {
      var selected = get_selected();
      const start_index = element.getStartOffset();
      const end_index = element.getEndOffsetInclusive();
      selected.deleteText(start_index, end_index);
      selected.insertText(start_index, new_text);
    });
  }
}

const API_KEY = "key";

function fetch_OpenaiAPI_gpt4(prompt) {
    var url = "https://api.openai.com/v1/chat/completions";
    var auth = "Bearer " + API_KEY;

    var Model_ID = "gpt-4o-mini-2024-07-18";
    // var maxTokens = 64;
    // var temperature = 1;
    // Build the API payload
    var payload = {
      "model": Model_ID, 
      "messages" :  [
        {
          "role": "system",
          "content": "You are an assistant, and have be given the selected text in the users Google Document file. "
        },
        {
          "role": "user",
          "content": prompt
        }
      ]
      // 'prompt': prompt,
      // 'temperature': temperature,
      // 'max_tokens': maxTokens,
    };

    var options = {
      "method": "post",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": auth
      },
      "payload": JSON.stringify(payload)
    };

    var response = UrlFetchApp.fetch(url, options);
    var responseData = JSON.parse(response.getBlob().getDataAsString());
    return responseData;
}
  
