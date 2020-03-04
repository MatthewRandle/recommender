import { toast } from "react-toastify";

export function editorSavedNotification() {
    if (!toast.isActive("editorSaved")) {
        toast.success("Changes Saved!", {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 2000,
            toastId: "editorSave",
            className: "notification_editorSaved",
            bodyClassName: "notification_editorSaved_body",
            progressClassName: "notification_editorSaved_progress"
        });
    }
}

export function errorNotification(component) {
    toast.error(component, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
        className: "notification_error",
        bodyClassName: "notification_error_body",
        progressClassName: "notification_error_progress"
    });
}