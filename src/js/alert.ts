declare const $: any;

export function afficherAlertSuccess(message: string): string {
    const alertSuccess = document.getElementById("alert-success");
    if (alertSuccess) {
        alertSuccess.innerHTML = `<i class="bi bi-check2-circle"></i> &nbsp;&nbsp;${message}`;
        $(alertSuccess).fadeIn(300);
        setTimeout(() => {
            $(alertSuccess).fadeOut(400);
        }, 1500);
    }
    return message;
}

export function afficherAlertWarning(message: string): string {
    const alertWarning = document.getElementById("alert-warning");
    if (alertWarning) {
        alertWarning.innerHTML = `<i class="bi bi-exclamation-triangle"></i> &nbsp;&nbsp;${message}`;
        $(alertWarning).fadeIn(300);
        setTimeout(() => {
            $(alertWarning).fadeOut(400);
        }, 1500);
    }
    return message;
}

export function afficherAlertFailure(message: string): string {
    const alertFailure = document.getElementById("alert-failure");
    if (alertFailure) {
        alertFailure.innerHTML = `<i class="bi bi-x-circle-fill"></i> &nbsp;&nbsp;${message}`;
        $(alertFailure).fadeIn(300);
        setTimeout(() => {
            $(alertFailure).fadeOut(400);
        }, 3000);
    }
    return message;
}
