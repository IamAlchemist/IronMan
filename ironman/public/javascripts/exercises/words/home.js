/**
 * Created by wizard on 11/1/16.
 */

require([], function () {
    $(document).ready(function () {
        setupWordsBandUpdateButton();
    });

    function setupWordsBandUpdateButton() {
        $('#updateWordsBankButton').click(function () {
            const button = $(this);
            button.attr({disabled: true});

            $.getJSON('/exercises/words/bank/update', function (json) {
                button.attr({disabled: false});
            })
        });
    }
});