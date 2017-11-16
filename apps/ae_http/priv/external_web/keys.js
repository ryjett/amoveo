
function new_keys() {
    var crypto_keys = ec.genKeyPair();
    return crypto_keys;
}
var keys = new_keys();
function pubkey_64() {
    var pubPoint = keys.getPublic("hex");
    return btoa(fromHex(pubPoint));
}
function sign_tx(tx) {
    sig = btoa(btoa(array_to_string(sign(tx, keys))));
    return ["signed", tx, sig, [-6]];
}
keys_function1();
function keys_function1() {
    var div = document.createElement("div");
    document.body.appendChild(div);
    
    //button to update displayed pubkey.
    var pubkey_button = document.createElement("input");
    pubkey_button.type = "button";
    pubkey_button.value = "check pubkey value";
    pubkey_button.onclick = update_pubkey;
    //div.appendChild(pubkey_button);

    var pub_div = document.createElement("div");
    div.appendChild(pub_div);

    var save_button = document.createElement("input");
    save_button.type = "button";
    save_button.value = "save keys to file";
    save_button.onclick = save_keys;
    div.appendChild(save_button);

    div.appendChild(document.createElement("br"));
    var file_selector = document.createElement("input");
    file_selector.type = "file";
    file_selector.onchange = load_keys;

    var load_text = document.createTextNode("get key from file ");
    div.appendChild(load_text);
    div.appendChild(file_selector);

    div.appendChild(document.createElement("br"));
    var new_pubkey_button = document.createElement("input");
    new_pubkey_button.type = "button";
    new_pubkey_button.value = "generate new keys";
    new_pubkey_button.onclick = new_keys_check;
    div.appendChild(new_pubkey_button);

    var new_pubkey_div = document.createElement("div");
    div.appendChild(new_pubkey_div);

    div.appendChild(document.createElement("br"));
    var balance_button = document.createElement("input");
    balance_button.type = "button";
    balance_button.value = "check balance";
    balance_button.onclick = update_balance;
    var bal_div = document.createElement("div");
    div.appendChild(bal_div);
    div.appendChild(balance_button);

    div.appendChild(document.createElement("br"));
    var spend_amount = document.createElement("INPUT");
    spend_amount.setAttribute("type", "text");
    spend_amount.id = "spend_amount";
    var spend_amount_info = document.createElement("h8");
    spend_amount_info.innerHTML = "amount to spend: ";
    div.appendChild(spend_amount_info);
    div.appendChild(spend_amount);

    var spend_address = document.createElement("INPUT");
    spend_address.setAttribute("type", "text");
    spend_address.id = "spend_address";
    var input_info = document.createElement("h8");
    input_info.innerHTML = "to pubkey: ";
    div.appendChild(input_info);
    div.appendChild(spend_address);

    var spend_button = document.createElement("BUTTON");
    spend_button.id = "spend_button";
    var spend_button_text = document.createTextNode("spend");
    spend_button.appendChild(spend_button_text);
    spend_button.onclick = spend_tokens;
    div.appendChild(spend_button);

    div.appendChild(document.createElement("br"));
    var create_amount = document.createElement("INPUT");
    create_amount.id = "create_amount";
    create_amount.setAttribute("type", "text"); 
    var create_amount_info = document.createElement("h8");
    create_amount_info.innerHTML = "initial balance of new account: ";
    div.appendChild(create_amount_info);
    div.appendChild(create_amount);

    var create_address = document.createElement("INPUT");
    create_address.id = "create_address";
    create_address.setAttribute("type", "text"); 
    var create_info = document.createElement("h8");
    create_info.innerHTML = "new pubkey: ";
    div.appendChild(create_info);
    div.appendChild(create_address);

    var create_button = document.createElement("BUTTON");
    create_button.id = "create_button";
    var create_button_text = document.createTextNode("create new account");
    create_button.appendChild(create_button_text);
    create_button.onclick = create_account;
    div.appendChild(create_button);

    update_pubkey();

    //console.log(fromHex(toHex("abc")));
    function update_pubkey() {
        pub_div.innerHTML = ("your pubkey: ").concat(pubkey_64());
    }
    function new_keys_check() {
        //alert("this will delete your old keys. If you have money secured by this key, and you haven't saved your key, then this money will be destroyed.");
        var warning = document.createElement("h3");
        warning.innerHTML = "This will delete your old keys. If money is sent to them, it will be deleted.";
        new_pubkey_div.append(warning);
        
        var button = document.createElement("input");
        button.type = "button";
        button.value = "cancel";
        button.onclick = cancel;
        new_pubkey_div.appendChild(button);

        var button2 = document.createElement("input");
        button2.type = "button";
        button2.value = "continue";
        button2.onclick = doit;
        new_pubkey_div.appendChild(button2);

        function cancel() {
            new_pubkey_div.innerHTML = "";
        }
        function doit() {
            new_pubkey_div.innerHTML = "";
            keys = new_keys();
            update_pubkey();
            set_balance(0);
        }
    }
    function update_balance() {
        var trie_key = pubkey_64();
        var top_hash = hash(serialize_header(top_header));
        variable_public_get(["proof", btoa("accounts"), trie_key, btoa(array_to_string(top_hash))], function(x) { update_balance2(trie_key, x); });
        //var trie_key = 1;
        //variable_public_get(["proof", btoa("governance"), trie_key, btoa(array_to_string(top_hash)], function(x) { update_balance2(trie_key, x); } );
    }
    function update_balance2(trie_key, proof0) {
        console.log(JSON.stringify(proof0));
        var val = verify_merkle(trie_key, proof0);
        console.log(val);
        var balance = val[1] / 100000000;
        bal_div.innerHTML = "your balance: " + (balance).toString();
    }
    function set_balance(n) {
        bal_div.innerHTML = ("balance: ").concat((n).toString());
        
    }
    function save_keys() {
        download(keys.getPrivate("hex"), "amoveo_light_keys", "text/plain");
    }
    function download(data, filename, type) {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }
    function load_keys() {
        var file = (file_selector.files)[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            keys = ec.keyFromPrivate(reader.result, "hex");
            update_pubkey();
            //update_balance();
        }
        reader.readAsText(file);
    }
}