var MAX_WIDTH = 750;
var MAX_HEIGHT = 650;
var CENTER_X = MAX_WIDTH / 2;
var CENTER_Y = MAX_HEIGHT / 2;

function redraw() {
    ctx.fillStyle = 'White';
    ctx.fillRect(0, 0, MAX_WIDTH, MAX_HEIGHT);
    ctx.fillStyle = 'grey';
    ctx.strokeStyle = 'grey';
    for (i in graph) {

        showPath(graph[i]);
        ctx.fillStyle = 'grey';
        ctx.strokeStyle = 'grey';
    }
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';

    for (var i = 1; i < graph.length; i++) {
        for (var j = i; j > 0 && graph[j].weight < graph[j - 1].weight; j--) {
            var temp = graph[j];
            graph[j] = graph[j - 1];
            graph[j - 1] = temp;
        }
    }
    realDots = [];
    for (i in graph) {
        var path = graph[i];
        if (realDots.indexOf(path.from) < 0)
            realDots.push(path.from);
        if (realDots.indexOf(path.to) < 0)
            realDots.push(path.to);
    }
}
function showPath(path) {
    var from = getCoor(path.from);
    var to = getCoor(path.to);
    if (path.weight === 0) {
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'red';
    }
    drawLine(from, to);
    showSquare(from, to, path.weight);
    ctx.fillStyle = 'grey';
    ctx.strokeStyle = 'grey';
    drawDot(path.from);
    drawDot(path.to);

}
function drawDot(numb) {
    var coor = getCoor(numb);
    ctx.beginPath();
    ctx.arc(coor.x, coor.y, 12, 0, Math.PI * 2);
    ctx.fill();
    var style = ctx.fillStyle;
    ctx.fillStyle = 'white';
    ctx.fillText(numb, coor.x - ((numb + "").length > 1 ? 9 : 4), coor.y + 5);
    ctx.fillStyle = style;
}
function drawLine(coorF, coorT) {
    ctx.beginPath();
    ctx.moveTo(coorF.x, coorF.y);
    ctx.lineTo(coorT.x, coorT.y);
    ctx.stroke();
}
function showSquare(from, to, weight) {
    var x = from.x / 10  + to.x / 10 * 9;
    var y = from.y / 10  + to.y / 10 * 9;
    var size = 15;
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
    var style = ctx.fillStyle;
    ctx.fillStyle = 'white';
    ctx.font = "10px Arial";
    ctx.fillText(weight, x - size / 2 + (((weight + "").length > 1) ? 1 : 5), y + size / 2 - 4);
    ctx.fillStyle = style;
    ctx.font = "15px Arial";
}
function getCoor(dot) {
    var dotsNumb = 1;
    for (var i in graph) {
        var path = graph[i];
        if (path.from > dotsNumb)
            dotsNumb = path.from;
        if (path.to > dotsNumb)
            dotsNumb = path.to;
    }
    var angle = Math.PI * (2 / dotsNumb * (dot - 1) - 0.5); //Math.PI*2/dotsNumb*dot - Math.PI/2 - Math.PI*2/dotsNumb
    var coorx = Math.cos(angle) * 300 + CENTER_X;
    var coory = Math.sin(angle) * 300 + CENTER_Y;
    return {
        x: coorx,
        y: coory
    };
}

var graph = [
    {
        from: 1,
        to: 2,
        weight: 9
    },
    {
        from: 2,
        to: 3,
        weight: 11
    },
    {
        from: 3,
        to: 4,
        weight: 4
    },
    {
        from: 2,
        to: 6,
        weight: 3
    },
    {
        from: 1,
        to: 6,
        weight: 6
    },
    {
        from: 1,
        to: 7,
        weight: 8
    },
    {
        from: 2,
        to: 7,
        weight: 9
    },
    {
        from: 6,
        to: 8,
        weight: 11
    },
    {
        from: 7,
        to: 6,
        weight: 17
    },
    {
        from: 8,
        to: 2,
        weight: 10
    },
    {
        from: 4,
        to: 8,
        weight: 4
    },
    {
        from: 4,
        to: 6,
        weight: 8
    },
    {
        from: 8,
        to: 5,
        weight: 17
    },
    {
        from: 5,
        to: 9,
        weight: 14
    },
    {
        from: 5,
        to: 10,
        weight: 17
    },
    {
        from: 9,
        to: 10,
        weight: 19
    },
    {
        from: 5,
        to: 8,
        weight: 27
    },
    {
        from: 10,
        to: 11,
        weight: 15
    }
];

var ctx = canvas.getContext('2d');
ctx.font = "15px Arial";
ctx.lineWidth = 1;
var realDots;
var dots;
var sum = [];
redraw();

$('#button').on('click', function () {
    var path = {
        from: Number($('#from').val()),
        weight: Number($('#weight').val()),
        to: Number($('#to').val())
    };
    if (path.from && path.weight && path.to) {
        var check = true;
        for (var i in graph) {
            var path1 = graph[i];
            if ((path1.from === path.from && path1.to === path.to) || (path1.to === path.from && path1.from === path.to) || path.to === path.from)
                check = false;
        }
        if (check)
            graph.push(path);
    }
    redraw();
});
$('#clear').on('click', function () {
    graph = [];
    redraw();
});
var currentSearch = 0;
$('#searchbut').on('click', function () {
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    var newSearch = Number($('#search').val());

    if (newSearch && realDots.indexOf(newSearch) > -1) {
        if (newSearch !== currentSearch) {
            currentSearch = newSearch;
            redraw();
            dots = [currentSearch];
            drawDot(currentSearch);
        }
        else if (dots.length < realDots.length) {
            for (var i in graph) {
                var path = graph[i];
                if (dots.indexOf(path.from) < 0 && dots.indexOf(path.to) >= 0) {
                    dots.push(path.from);
                    showPath(path);
                    break;
                }
                if (dots.indexOf(path.from) >= 0 && dots.indexOf(path.to) < 0) {
                    dots.push(path.to);
                    showPath(path);
                    break;
                }
            }
        }
    } else
        alert("Ви ввели неіснуючу точку");
});

$('#ford_search').on('click', function () {
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    var start = Number($('#ford_start').val());
    var end = Number($('#ford_end').val());

    if (start && end && realDots.indexOf(end) > -1 && realDots.indexOf(start) > -1) {

        function deepsearch(dot) {
            if (dot !== end && !found) {
                visited.push(dot);
                for (var i in graph) {
                    if (!found && graph[i].weight > 0) {
                        var path = graph[i];
                        if (path.from === dot && visited.indexOf(path.to) < 0) {
                            stack.push(path.to);
                            deepsearch(path.to);
                            stack.pop();
                            //continue;
                        }
                        /*if (path.to === dot && visited.indexOf(path.from) < 0) {
                            stack.push(path.from);
                            deepsearch(path.from);
                            stack.pop();
                        }*/
                    }
                }
            } else {
                console.log(stack);
                size = stack.size-1;
                found = true;
            }
        }

        var found = false;
        var visited = [];
        var size;
        var stack = {
            size: 1,
            arr: [start],
            top: function () {
                return this.arr[this.size - 1];
            },
            push: function (val) {
                this.arr[this.size++] = val;
            },
            pop: function () {
                return this.arr[--this.size];
            }
        };

        deepsearch(start);
        if (found) {
            var min = 100000;
            var minFrom;
            var minTo;
            for (var j = 0; j < size; j++) {
                for (var k in graph) {
                    var path = graph[k];
                    if (((path.to === stack.arr[j] && path.from === stack.arr[j + 1] ) || (path.to === stack.arr[j + 1] && path.from === stack.arr[j])) && (min > path.weight)) {
                        min = path.weight;
                        minFrom = path.to;
                        minTo = path.from;
                    }
                }
            }
            var res = 0;
            for (var i = 0; i < size; i++) {
                for (var n in graph) {
                    var path = graph[n];
                    if ((path.to === stack.arr[i] && path.from === stack.arr[i + 1] ) || (path.to === stack.arr[i + 1] && path.from === stack.arr[i])) {
                        console.log(path);
                        path.weight -= min;
                        res = min;
                    }
                }
            }
            redraw();
            sum.push(res);
            var dod = 0;
            for (var i in sum)
                dod += sum[i];
            $('#sum')[0].innerHTML = "";
            //for (var i in graph)
            //    $('#sum')[0].innerHTML += "<br>Path is: " + graph[i];
            for (var i = 0; i < sum.length; i++)
                $('#sum')[0].innerHTML += sum[i] + ' ';
            $('#sum')[0].innerHTML += "<br>Sum is: " + dod;
        }
    } else
        alert("Ви ввели неіснуючу точку");
});


$('#delete').on('click', function () {
    var dot = Number($('#dot').val());
    for (var i = 0; i < graph.length; i++) {
        var dot2del = graph[i];
        if (dot2del.from === dot || dot2del.to === dot) {
            graph.splice(i, 1);
            i--;
        }
    }
    redraw();
});