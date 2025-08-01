import styles from './login.module.css'

export const inputFocus = (e) =>
{
    e.target.closest('div').classList.add(styles.inputFocused)
    const placeholder = e.target.closest('div').children[1]
    placeholder.classList.add(styles.placeholderWhileInputIsFocus)
    placeholder.classList.add(styles.placeholderWhileInputIsFocusColor)
}

export const inputBlur = (e) =>{
    e.target.closest('div').classList.remove(styles.inputFocused)
    const placeholder = e.target.closest('div').children[1]
    if(e.target.value.trim() == "")
    {
        placeholder.classList.remove(styles.placeholderWhileInputIsFocus)
        placeholder.classList.remove(styles.placeholderWhileInputIsFocusColor)
    }
    else
    {
         placeholder.classList.remove(styles.placeholderWhileInputIsFocusColor)
    }
}