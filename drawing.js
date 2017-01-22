<!--setja textasvæði sem er hidden, svo þegar smellt er, birtist það   -->
var drawing = {
    title: "Nú er gaman",
    content: "the contents of the shapes array"
};

var url = "http://localhost:3000/api/drawings";

function senda(){

$.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: url,
    data: JSON.stringify(drawing),
    success: function (data) {
        // The drawing was successfully saved
    },
    error: function (xhr, err) {
        // The drawing could NOT be saved
    }
});

}

console.log(drawing);