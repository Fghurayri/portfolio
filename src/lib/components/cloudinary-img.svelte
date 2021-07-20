<script>
  export let src;
  export let alt;
  export let extraClass = "";
  function transform() {
    const preset = "f_auto,q_auto:good";
    const splitted = src.split("/");
    const indexOfKey = splitted.indexOf("upload");
    splitted.splice(indexOfKey + 1, 0, preset);
    return splitted.join("/");
  }
</script>

<img src={transform()} {alt} class={`${extraClass} rounded-xl`} />
