/***
 * This script searches for the presence of a specific field by continuously refreshing this page
 */
timeout = 2;
count = 0;
targetBatch = 'Collect data and finish in 5 min';
isTargetFound = false;
// location.href refers to the website of this page
current = location.href;

function reload() {
    // Execute reload function after timeout seconds to achieve infinite loop refresh  
    setTimeout('reload()', 1000 * timeout);

    // The following two lines of code are formatted as below
    // <frameset cols='*'>  
    //     <frame src='URL of the current address bar' />  
    // </frameset>  
    var fr4me = '<frameset cols=\'*\'>\n<frame src=\'' + current + '\' />';
    fr4me += '</frameset>';

    if (!isTargetFound) {
        with (document) {
            if (lookForBatch()) {
                // Reference the document object, call the write method to write to the frame and open a new window  
                write(fr4me);
                // Close the window above  
                void (close());
                console.log(getCurrentTime());
            }
            else {
                console.log('The target has been found');
            }
        }
    }

}

// Get the current time in milliseconds
function getCurrentTime() {
    var myDate = new Date().getTime();
    return myDate;
}

// Check if the frameset contains the target HIT batch
function lookForBatch() {
    //console.log(window.document.activeElement.innerText);
    if (window.document.activeElement.innerText.indexOf(targetBatch) !== -1) {
        console.log('Target batch found at: ' + getCurrentTime() + '\n');
        isTargetFound = true;
        return false;
    }
    else {
        return true;
    }
}

// Print out the object with circular reference
const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};

reload();