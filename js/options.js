/**
 * Created by Mikolaj on 2015-05-03.
 */
$(document).ready(function() {
    var pointedElement = undefined;

    paper.on('cell:pointerdown', function (cellView, evt, x, y) {
        displayOptions(cellView.model);
    });

    window.displayOptions = function(cell){
        pointedElement = cell;
        if (pointedElement instanceof joint.shapes.pn.Place) {
            preparePlaceOptions(pointedElement);
        } else if (pointedElement instanceof joint.shapes.pn.Transition) {
            prepareTransitionOptions(pointedElement);
        } else if (pointedElement instanceof joint.shapes.pn.Link) {
            prepareLinkOptions(pointedElement);
        }
    }

    function preparePlaceOptions(place) {
        var labelPath = ".label/text";
        var tokensPath = "tokens";
        var label = place.attr(labelPath);
        var tokensNb = place.get(tokensPath);

        var options = {
            label: new Option("Label", "labelOption", label, getAttrUpdateFunction(place, labelPath)),
            tokens: new Option("Tokens number", "tokensOption", tokensNb, getIntTokenUpdateFunction(place, tokensPath))
        };
        prepareOptions(options);
        prepareUpdate(options);
        setButtonActions(place);
    }

    function prepareTransitionOptions(transition) {
        var labelPath = ".label/text";
        var priorityPath = ".priority-nb/text";
        var label = transition.attr(labelPath);
        var priorityNb = transition.attr(priorityPath);

        var options = {
            label: new Option("Label", "labelOption", label, getAttrUpdateFunction(transition, labelPath)),
            priority: new Option("Priority", "priorityOption", priorityNb, getIntAttrUpdateFunction(transition, priorityPath))
        };
        prepareOptions(options);
        prepareUpdate(options);
        setButtonActions(transition);
    }

    function prepareLinkOptions(link) {
        var value = linkValue(link);

        var options = {
            label: new Option("Value", "labelOption", value, getIntLabelUpdateFunction(link))
        };
        prepareOptions(options);
        prepareUpdate(options);
        setButtonActions(link);
    }

    function getAttrUpdateFunction(element, path) {
        return function () {
            var newValue = $(this).val();
            if (element.attr(path) !== newValue) {
                element.attr(path, newValue);
            }
        };
    }

    function getIntAttrUpdateFunction(element, path) {
        return function () {
            if (validateNumber($(this))) {
                var newValue = parseInt($(this).val());
                if (element.attr(path) !== newValue) {
                    element.attr(path, newValue);
                    resimulateIfNecessary();
                }
            }
        };
    }

    function getIntTokenUpdateFunction(element, path) {
        return function () {
            if (validateNumber($(this))) {
                var newValue = parseInt($(this).val());
                if (element.get(path) !== newValue) {
                    element.set(path, newValue);
                    resimulateIfNecessary();
                }
            }
        }
    };


    function getIntLabelUpdateFunction(element) {
        return function () {
            if (validateNumber($(this))) {
                var newValue = parseInt($(this).val());
                if (newValue === 1) {
                    newValue = '';
                }
                if (element.label(0).attrs.text.text !== newValue) {
                    element.label(0, {position: .5, attrs: {text: {text: newValue}}});
                    resimulateIfNecessary();
                }
            }
        }
    }

    function validateNumber($input) {
        var $errorMessage = $input.parent().next();
        if ($errorMessage !== null) {
            $errorMessage.remove();
        }
        if (isNaN($input.val())) {
            $input.parent().after("<td style='color: #ff0000'>Value has to be an integer</td>");
            return false;
        } else {
            return true;
        }
    }

    function Option(label, id, value, updateFn) {
        this.label = label;
        this.id = id;
        this.value = value;
        this.update = updateFn;
    }


    function prepareOptions(options) {
        var $options = $('#elements-options');
        saveChanges($options);
        $options.empty();
        $options.append(
            "<h4>Options</h4>" +
            "<form>");
        var $form = $('#elements-options form')
        for (var option in options) {
            $form.append(
                "<div class='form-group'>" +
                "   <label>" + options[option].label + "</label>" +
                "   <input name='" + options[option].id + "' value='" + options[option].value + "'/>" +
                "</div>"
            )
        }
        $form.append(
            "   <button class='btn btn-default btn-sm' id='remove'>Remove</button>" +
            "   <button class='btn btn-default btn-sm' id='clone'>Clone</button>"
        );
    }

    function saveChanges($options) {
        $options.find('input').trigger("focusout");
    }

    function prepareUpdate(options) {
        for (var opt in options) {
            var option = options[opt];
            $("input[name=" + option.id + "]").focusout(option.update);
        }
    }

    window.simulationUpdate = function (place, newTokensNb) {
        if (pointedElement && pointedElement.id === place.id) {
            $("input[name=tokensOption]").val(newTokensNb);
        }
    }

    function setButtonActions(element) {
        $('#remove').click(function (e) {
            element.remove();
            e.preventDefault();
        });
        $('#clone').click(function (e) {
            var newEl = element.clone();
            displayOptions(newEl);
            graph.addCell(newEl);
            e.preventDefault();
        });
    }

    graph.on('remove', function (cell) {
        $('#elements-options').empty();
        $('#elements-options').append("<h4>Options</h4>");
        resimulateIfNecessary();
    });

    $('#elements-options').keydown(function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
});