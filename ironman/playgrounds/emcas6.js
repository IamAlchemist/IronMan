/**
 * Created by wizard on 11/2/16.
 */
const className = 'alert-warning',
    message = 'hello';

const text = `<div class="alert ${className} alert-dismissible" role="alert">
                  <button type="button" class="close" data-dismiss="alert">
                      <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                  </button>
                  ${message}
                </div>`;

console.log(text);
