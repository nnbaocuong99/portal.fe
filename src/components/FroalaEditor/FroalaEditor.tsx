// import "froala-editor/js/plugins/fullscreen.min.js"

// Require Editor JS files.
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/js/third_party/embedly.min.js";

// Require Editor CSS files.
import "froala-editor/css/third_party/embedly.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import React from "react";

import Froala from "react-froala-wysiwyg";
// import "tributejs/dist/tribute.css";
import "froala-editor/js/plugins/align.min.js";
import "./FroalaEditor.scss";
import { Observable } from "rxjs";
import { Model, ModelFilter } from "react3l-common";

export interface FroalaEditorProps<
  T extends Model,
  TModelFilter extends ModelFilter
> {
  value?: string;

  className?: string;

  editorConfig?: Record<string, any>;

  onChange?(value: string): void;

  placeholder?: string;

  getList?: (TModelFilter?: TModelFilter) => Observable<T[]>;

  classFilter?: new () => TModelFilter;

  modelFilter?: TModelFilter;
}

const FroalaEditorComponent = React.forwardRef(
  (props: FroalaEditorProps<Model, ModelFilter>, ref: any) => {
    const { value = null, onChange, placeholder } = props;

    const handleChange = React.useCallback(
      (...[content]: any) => {
        if (typeof onChange === "function") {
          onChange(content);
        }
      },
      [onChange]
    );

    const config = {
      attribution: false,
      placeholderText: placeholder,
      toolbarButtons: {
        moreText: {
          buttons: [
            "bold",
            "italic",
            "underline",
            "strikeThrough",
            "subscript",
            "superscript",
            "fontFamily",
            "fontSize",
            "textColor",
            "backgroundColor",
            "inlineClass",
            "inlineStyle",
            "clearFormatting",
          ],
        },
        moreParagraph: {
          buttons: [
            "alignLeft",
            "alignCenter",
            "formatOLSimple",
            "alignRight",
            "alignJustify",
            "formatOL",
            "formatUL",
            "paragraphFormat",
            "paragraphStyle",
            "lineHeight",
            "outdent",
            "indent",
            "quote",
          ],
        },
        moreRich: {
          buttons: [
            "insertLink",
            "insertImage",
            "insertVideo",
            "insertTable",
            "emoticons",
            "fontAwesome",
            "specialCharacters",
            "embedly",
            "insertFile",
            "insertHR",
          ],
        },
        moreMisc: {
          buttons: [
            "undo",
            "redo",
            "fullscreen",
            "print",
            "getPDF",
            "spellChecker",
            "selectAll",
            "html",
            "help",
          ],
          align: "right",
          buttonsVisible: 2,
        },
      },
      pluginsEnabled: [
        "table",
        "spell",
        "quote",
        "save",
        "quickInsert",
        "paragraphFormat",
        "paragraphStyle",
        "help",
        "draggable",
        "align",
        "link",
        "lists",
        "file",
        "image",
        "emoticons",
        "url",
        "video",
        "embedly",
        "colors",
        "entities",
        "inlineClass",
        "inlineStyle",
        "imageTUI",
      ],
    };

    return (
      <Froala
        ref={ref}
        model={value}
        onModelChange={handleChange}
        tag="textarea"
        config={config}
      />
    );
  }
);

export default FroalaEditorComponent;
