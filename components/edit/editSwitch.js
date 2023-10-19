import { useState } from "react";
import cn from "classnames";

const EditSwitch = ({ label, onChange }) => {

    const [checked, setChecked] = useState(false);

    const checkClass = cn('sr-only peer', { 'peer-checked': checked });

    console.log({ checked })

    return <label className="relative inline-flex items-center mr-5 cursor-pointer">
        <input type="checkbox" className={checkClass} onChange={() => {
            onChange();
            setChecked(!checked);
        }} checked={checked} />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>
    </label>

}

export default EditSwitch