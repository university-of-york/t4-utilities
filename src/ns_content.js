/**
 * Utility functionality related to content.
 * @namespace
 */
content: {
  /**
   * Get the value of a content element.
   *
   * @param {string} element          The name of the element to get
   * @param {Object[]} [opts]         An options object
   * @param {string} opts[].type      <p>The type of Content Element (we might be able to get this programmatically)</p>
   * <ul>
   *   <li>cascading_list</li>
   *   <li>checkbox</li>
   *   <li>content_owner</li>
   *   <li>datetime</li>
   *   <li>decimal_number</li>
   *   <li>file</li>
   *   <li>group_select</li>
   *   <li>html</li>
   *   <li>image</li>
   *   <li>keyword_selector</li>
   *   <li>media</li>
   *   <li>multi_select_list</li>
   *   <li>multiple_select</li>
   *   <li>plain_text</li>
   *   <li>radio_button</li>
   *   <li>section_content_link</li>
   *   <li>select_box</li>
   *   <li>whole_number</li>
   * </ul>
   * @param {string} opts[].data        <p>The field that should be returned from a list (any Content Elements that use lists - select from "name" or "value") <b>OR</b></p>
   *                                    <p>The information that should be shown for a content owner ("content-owner" only) <b>OR</b></p>
   *                                    <p>The information that should be returned for media ("media" only - select from "path", "width", "height", "description") <b>OR</b></p>
   *                                    <p>The type of link information that should be returned from a Section/Content Link - select from "linktext" or"linkurl" <b>OR</b></p>
   *                                    <p>The modifiers used in a T4 tag to render an HTML Content Type ("html" only, e.g. "medialibrary, nav_sections") <b>OR</b></p>
   *                                    <p>The format a "datetime" Content Type should be returned in e.g."Y-m-d" for "date"</p>
   *
   * @returns {string}                  The value of the content element, formatted in the appropriate way (or false, if it fails)
   */
  get: function (element, opts) {

    try {

      var r = false;

      switch (opts.type) {
        case "cascading_list":
        case "checkbox":
        case "group_select":
        case "keyword_selector":
        case "multi_select_list":
        case "multiple_select":
        case "radio_button":
        case "select_box":
          document.write('t4 type="content" name="'+element+'" output="normal" display_field="'+opts.data+'"');
          document.write(this.base.processTags);
          r = this.base.processTags('<t4 type="content" name="'+element+'" output="normal" display_field="'+opts.data+'" />');
          break;
        case "content_owner":
          r = this.base.processTags('<t4 type="content" name="'+element+'" output="userinfo" info="'+opts.data+'" />');
          break;
        case "datetime":
          r = this.base.processTags('<t4 type="content" name="'+element+'" output="normal" modifiers="" date_format="'+opts.data+'" />');
          break;
        case "decimal_number":
          r = this.base.processTags('<t4 type="content" name="'+element+'" output="normal" modifiers="" />');
          break;
        case "file":
          r = this.base.processTags('<t4 type="content" name="'+element+'" output="file" />');
          break;
        case "html":
          r = this.base.processTags('<t4 type="content" name="'+element+'" output="normal" modifiers="'+opts.data+'" />');
          break;
        case "image":
          r = this.base.processTags('<t4 type="content" name="'+element+'" output="image" />');
          break;
        case "media":
          var formatter;
          switch (opts.data) {
            case "path":
              formatter = "path/*";
              break;
            case "height":
              formatter = "image/height";
              break;
            case "width":
              formatter = "image/width";
              break;
            case "description":
              formatter = "image/description";
              break;
          }
          r = this.base.processTags('<t4 type="content" name="'+element+'" output="normal" modifiers="" formatter="'+formatter+'" />');
          break;
        case "plain_text":
        case "whole_number":
          content.get(element);
          break;
        case "section_content_link":
          r = this.base.processTags('<t4 type="content" name="'+element+'" output="'+opts.data+'" />');
          break;

      }

      return r;

    } catch (e) {

      return false;

    }

  },
  /**
   * Get the dimensions of an element wthin content that contains an image.
   * <p>
   *  It should be noted that in this case the use of the word image refers to
   *  any element within the content that contains an image file, as opposed
   *  to the element being of type 'Image'.
   * </p>
   * @param {string} content The piece of content that contains the element.
   * @param {string} element The element within the content that contains the image.
   * @returns {Array} The image dimensions as an array of numbers [ width | height ]
   */
  getImageDimensions: function (content, element) {
    return content.get(element).getImageDimensions();
  }
},
