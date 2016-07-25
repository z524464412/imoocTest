
# Demo

----

## Input

<textarea id="input-content" style="width:99%; height:100px;"></textarea>

## Output

<pre id="output-content"></pre>

<script>
seajs.use(["jquery", "md5"], function($, md5){

  function calcMD5(){
    $("#output-content").text(md5(this.value));
  }

  $("#input-content").keyup(calcMD5);

  calcMD5();
});
</script>
