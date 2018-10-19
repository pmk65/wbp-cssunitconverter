function ShowUnitConverter() {

	// Global variables
	var modalForm,	 			// Modal Object
			cmbFrom,		 			// "From" Combobox Object
			cmbTo,						// "To" Combobox Object
			lblFactor,				// "Factor" Label Object
			txtBaseSize,			// "Base size" Edit Object
			chkInvert,				// "Invert Base size" Checkbox Object
			cmbDecimalPlaces,	// "Decimal precision" Combobox Object
			btnOK,						// "OK" Button Object
			btnCancel,				// "Cancel" Button Object
			// Some systems use COMMA as decimal separator instead of PERIOD
 			// Create a floating point number and remove the digits to get the internal decimal separator.
			decimalSeparator		= RegexReplace(_t(1/2), "\\d*", "", true),
			excludeLeadingZero	= _t(Script.ReadSetting("Exclude leading zero", "1")),
			validColor					= "$0025563b", // #3B5625;
			invalidColor				= "$00353577", // #773535;
			selection 					= Editor.SelText; //obtain current selection


	/**
	 *
	 * Main function
	 *
	 * @return      void
	 *
	 */
	function main() {

		if (Document.CurrentCodeType != 3) {
			alert("Not a CSS file or inside a style tag!");
			return;
		}

		if (selection == "") {
			alert("No CSS data selected!");
			return;
		}

		CreateModal();

	  var modalResult = modalForm.ShowModal;
		if (modalResult == mrOK) {
			ConvertUnits();
		}
		// Remove Modal object
		delete modalForm;
	}

	/**
	 *
	 * Helper function: Test if a string is a valid positive number (integer or float)
	 *
	 * @param     string  str: The string to test
	 * @return    bool    true if string is a valid number
	 *
	 */
	function IsValidNumber(str) {
		if ((str != "") && (str == RegexMatch(str, "^\\d*\\.?\\d+\\b$", true))) return true;
		return false;
	}

	/**
	 *
	 * Helper function: Round float var to specific number of decimals
	 *
	 * @param     float   floatVar: The number to round
	 * @param     int     decimalPlaces: Number of decimals
	 * @return    float
	 *
	 */
	function RoundFloat(floatVar, decimalPlaces) {
		var p = StrToInt(Copy("1000000000", 1, decimalPlaces + 1)),
				t = floatVar * p,
				r = Trunc(t);
				if (Frac(t) >= (1/2)) r = r + 1;
				return (r / p);
 	}

	/**
	 *
	 * Helper function: Convert internal decimal separator into a PERIOD
	 *
	 * @param     mixed  value: The value to change
	 * @return    string
	 *
	 */
	function InternalToPeriod(value) {
		return Replace(_t(value), decimalSeparator, ".");
	}

	/**
	 *
	 * Helper function: Convert PERIOD into internal decimal separator
	 *
	 * @param     mixed  value: The value to change
	 * @return    string
	 *
	 */
	function PeriodToInternal(value) {
		return Replace(_t(value), ".", decimalSeparator);
	}

	/**
	 *
	 * Main conversion function
	 *
	 * @param     atring  fromUnit: The value to convert
	 * @return    string  converted value or "-" if conversion failed
	 *
	 */
	function ConvertUnit(fromUnit) {
		var toUnit = "-",
				baseSize = txtBaseSize.Text,
				decimals = StrToInt(cmbDecimalPlaces.Text);

		if (IsValidNumber(baseSize)) {
			baseSize = StrToFloat(PeriodToInternal(baseSize));
			if (baseSize != 0) {
				fromUnit = StrToFloat(PeriodToInternal(fromUnit));
				if (chkInvert.Checked) {
					toUnit = fromUnit * baseSize;
				}
				else {
			 		toUnit = fromUnit / baseSize;
				}
				toUnit = InternalToPeriod(_t(RoundFloat(toUnit, decimals)));
			}
		}
		return toUnit;
	}

	/**
	 *
	 * Create the Modal GUI Form
	 *
	 * @return      void
	 *
	 */
	function CreateModal() {

	  var mleft = 16,
				mtop = 14,
				lspace = 6,
				vspace = 26;

	  modalForm = new TForm(WeBuilder);
	  modalForm.Width = 276;
	  modalForm.Height = 193;
	  modalForm.Position = poScreenCenter;
	  modalForm.BorderStyle = bsSingle; //disable dialog resizing
	  modalForm.BorderIcons = biSystemMenu; //remove maximize & minimize buttons
	  modalForm.Caption = "CSS Unit Converter";

		// 1st line of controls

		// From unit label object
	  var lbFrom = new TLabel(modalForm);
	  lbFrom.Parent = modalForm;
	  lbFrom.Caption = "Convert from:";
	  lbFrom.SetBounds(mleft, mtop, 80, 15);

		// From unit selectbox object
	  cmbFrom = new TComboBox(modalForm);
	  cmbFrom.Parent = modalForm;
	  cmbFrom.Items.Add("px");
	  cmbFrom.Items.Add("em");
	  cmbFrom.Items.Add("rem");
	  cmbFrom.Items.Add("ex");
	  cmbFrom.Items.Add("ch");
	  cmbFrom.Items.Add("vw");
	  cmbFrom.Items.Add("vh");
	  cmbFrom.Items.Add("vmin");
	  cmbFrom.Items.Add("vmax");
	  cmbFrom.Items.Add("pt");
	  cmbFrom.Items.Add("pc");
	  cmbFrom.Items.Add("cm");
	  cmbFrom.Items.Add("mm");
	  cmbFrom.Items.Add("in");
	  cmbFrom.ItemIndex = 0;
		cmbFrom.Style = csOwnerDrawFixed; // If set to csDropDown (default value) then keyboard entry is possible
		cmbFrom.OnChange = "UpdateFactor";
		cmbFrom.Hint = "The unit type you wan to convert FROM.";
		cmbFrom.ShowHint = true;
	  cmbFrom.SetBounds(mleft + 80 + lspace, mtop-3, 60, 21);

		// To unit label object
	  var lbTo = new TLabel(modalForm);
	  lbTo.Parent = modalForm;
	  lbTo.Caption = "to:";
	  lbTo.SetBounds(mleft + 80 + 60 + lspace + lspace, mtop, 20, 15);

		// To unit selectbox object
	  cmbTo = new TComboBox(modalForm);
	  cmbTo.Parent = modalForm;
	  cmbTo.Items.Add("px");
	  cmbTo.Items.Add("em");
	  cmbTo.Items.Add("rem");
	  cmbTo.Items.Add("ex");
	  cmbTo.Items.Add("ch");
	  cmbTo.Items.Add("vw");
	  cmbTo.Items.Add("vh");
	  cmbTo.Items.Add("vmin");
	  cmbTo.Items.Add("vmax");
	  cmbTo.Items.Add("pt");
	  cmbTo.Items.Add("pc");
	  cmbTo.Items.Add("cm");
	  cmbTo.Items.Add("mm");
	  cmbTo.Items.Add("in");
	  cmbTo.ItemIndex = 1;
		cmbTo.Style = csOwnerDrawFixed; // If set to csDropDown (default value) then keyboard entry is possible
		cmbTo.OnChange = "UpdateFactor";
		cmbTo.Hint = "The unit type you wan to convert TO.";
		cmbTo.ShowHint = true;
	  cmbTo.SetBounds(mleft + 80 + 60 + 20 + lspace + lspace + lspace, mtop-3, 60, 21);

		// 2nd line of controls

		// Factor label object
	  lblFactor = new TLabel(modalForm);
	  lblFactor.Parent = modalForm;
	  lblFactor.Caption = "Conversion factor: 1px = 0.063em "; // Extra space needed at the end due to windows italics bug
		lblFactor.Font.Style = fsItalic + fsBold;
		lblFactor.Font.Color = validColor;
		lblFactor.Hint = "This is an example of the conversion based on the current settings.";
		lblFactor.ShowHint = true;
		lblFactor.Cursor = crHelp;
		lblFactor.OnClick = "ShowInfo";
	  lblFactor.setBounds(mleft, mtop + (vspace*1), 270, 15);

		// 3rd line of controls

		// Base size label object
	  var lbBaseSize = new TLabel(modalForm);
	  lbBaseSize.Parent = modalForm;
	  lbBaseSize.Caption = "Base size:";
	  lbBaseSize.SetBounds(mleft, mtop + (vspace*2), 58, 15);

		// Base size input object
	  txtBaseSize = new TEdit(modalForm);
	  txtBaseSize.Parent = modalForm;
		txtBaseSize.Text = "16";
		txtBaseSize.OnKeyPress = "NumbersAndPeriodOnly";
		txtBaseSize.OnKeyUp = "UpdateFactor";
		txtBaseSize.OnExit = "UpdateFactor";
		txtBaseSize.Hint = "Base size for the conversion.";
		txtBaseSize.ShowHint = true;
	  txtBaseSize.SetBounds(mleft + 58 + lspace, mtop + (vspace*2)-3, 50, 21);

		// Invert base size label object
	  var lblInvert = new TLabel(modalForm);
	  lblInvert.Parent = modalForm;
	  lblInvert.Caption = "Invert base size:";
	  lblInvert.setBounds(mleft + 58 + 50 + lspace + lspace , mtop + (vspace*2), 95, 15);

		// Invert base size checkbox object
	  chkInvert = new TCheckBox(modalForm);
	  chkInvert.Parent = modalForm;
	  chkInvert.Checked = false;
		chkInvert.OnClick = "UpdateFactor";
		chkInvert.Hint = "If checked Base Size will be Unit*Base Size.";
		chkInvert.ShowHint = true;
	  chkInvert.setBounds(mleft + 58 + 50 + 95 + lspace + lspace + lspace , mtop + (vspace*2)-1, 80, 21);

		// 4th line of controls

		// Decimal Places label object
	  var lbDecimalPlaces = new TLabel(modalForm);
	  lbDecimalPlaces.Parent = modalForm;
	  lbDecimalPlaces.Caption = "Decimal precision:";
	  lbDecimalPlaces.SetBounds(mleft, mtop + (vspace*3), 105, 15);

		// Decimal Places selectbox object
	  cmbDecimalPlaces = new TComboBox(modalForm);
	  cmbDecimalPlaces.Parent = modalForm;
	  cmbDecimalPlaces.Items.Add("0");
	  cmbDecimalPlaces.Items.Add("1");
	  cmbDecimalPlaces.Items.Add("2");
	  cmbDecimalPlaces.Items.Add("3");
	  cmbDecimalPlaces.Items.Add("4");
	  cmbDecimalPlaces.Items.Add("5");
	  cmbDecimalPlaces.ItemIndex = 3;
		cmbDecimalPlaces.Style = csOwnerDrawFixed; // If set to csDropDown (default value) then keyboard entry is possible
		cmbDecimalPlaces.OnChange = "UpdateFactor";
		cmbDecimalPlaces.Hint = "Number of decimals used in the results.";
		cmbDecimalPlaces.ShowHint = true;
	  cmbDecimalPlaces.SetBounds(mleft + 105 + lspace, mtop + (vspace*3)-3, 40, 21);

		// 5th line of controls

		// OK button object
	  btnOk = new TButton(modalForm);
	  btnOK.Parent = modalForm;
	  btnOk.Caption = "OK";
	  btnOk.Default = True;
	  btnOK.ModalResult = mrOK;
	  btnOk.SetBounds(mleft, mtop + (vspace*4), 75, 25);

		// Cancel button object
	  btnCancel = new TButton(modalForm);
	  btnCancel.Parent = modalForm;
	  btnCancel.Caption = "Cancel";
	  btnCancel.Cancel = True;
	  btnCancel.ModalResult = mrCancel;
	  btnCancel.SetBounds(modalForm.Width - 75 - lspace - mleft, mtop + (vspace*4), 75, 25);
	}


	/**
	 *
	 * OnKeyPress event handler
	 * Prevent entry of chars other than numbers and a single period
	 * Setting key to chr(0) prevents the char from being entered
	 *
	 * @param     object  Sender: The parent object
	 * @param     string  key: The character key pressed
	 * @return    void
	 *
	 */
	function NumbersAndPeriodOnly(Sender, key) {
		if ((key == RegexMatch(Sender.Text, "\\.", true)) || (key != RegexMatch(key, "[\\x00\\x08\\x09\\x0D\\x1B\\.\\d]", true))) key = chr(0);
	}

	/**
	 *
	 * OnClick, OnChange, OnExit, OnKeyUp event handler
	 * Updates the "Conversion Factor" label when form values change
	 *
	 * @param     object  Sender: The parent object
	 * @param     string  key: The character key pressed
	 * @return    void
	 *
	 */
	function UpdateFactor(Sender, key) {
		var fromUnit = "1",
				color		 = invalidColor,
				caption	 = "Enter a valid Base size!",
				toUnit = ConvertUnit(fromUnit);
		if (toUnit != "-") {
			color = validColor;
			caption = "Conversion factor: " + _t(fromUnit) + cmbFrom.Text + " = " + toUnit + cmbTo.Text;
 		}
		lblFactor.Font.Color = color;
		lblFactor.Caption = caption + " "; // Extra space needed at the end due to windows italics bug.
	}

	/**
	 *
	 * OnClick event handler
	 * Displays Unit info box when "Conversion Factor" label is clicked
	 *
	 * @param     object  Sender: The parent object
	 * @return    void
	 *
	 */
	function ShowInfo(Sender) {
		var ar = " " + chr(10132) + " ";
		alert("px"   + ar + "pixels (1px = 1/96th of 1in)\n" +
					"em"   + ar + "Relative to the font-size of the element\n" +
					"ex"   + ar + "Relative to the x-height of the current font (rarely used)\n" +
					"ch"   + ar + "Relative to width of the '0' (zero)\n" +
					"rem"  + ar + "Relative to font-size of the root element\n\n" +
					"vw"   + ar + "Relative to 1% of the width of the viewport\n" +
					"vh"   + ar + "Relative to 1% of the height of the viewport\n" +
					"vmin" + ar + "Relative to 1% of viewport's smaller dimension\n" +
					"vmax" + ar + "Relative to 1% of viewport's larger dimension\n\n" +
					"pt"   + ar + "point (Only useful for print layouts)\n" +
					"pc"   + ar + "pica (Only useful for print layouts)\n" +
					"cm"   + ar + "centimeter (Only useful for print layouts)\n" +
					"mm"   + ar + "millimeter (Only useful for print layouts)\n" +
					"in"   + ar + "inch (Only useful for print layouts)\n\n" +
					"(1in = 2.54cm = 25.4mm = 72pt = 6pc)");
	}

	/**
	 *
	 * Loop through editor selection and convert units
	 *
	 * @return    void
	 *
	 */
	function ConvertUnits() {
		var unitMatch = RegexMatch(selection, "\\d*\\.?\\d*" + cmbFrom.Text, true), // Find first match
				len = Length(unitMatch),
				fromUnit,
				toUnit;

		while(len > 0) {
			// Remove unit type
			fromUnit = Replace(unitMatch, cmbFrom.Text, "");

			// Convert
      toUnit = ConvertUnit(fromUnit);

			// Invalid BaseSize!
			if (toUnit == "-") {
				Script.ClearMessages;
				Script.Message("Conversion aborted due to invalid Base size!");
				break;
			}

			// Remove leading zero from float value if plugin option is set
			if (excludeLeadingZero == "1") {
				toUnit = RegexReplace(toUnit, "^0\\.", ".", true);
			}

			selectionBefore = selection;

			// Can't use \b as starting boundary as that would exclude numbers like .5, which doesn't have a leading zero.
			selection = RegexReplace(selection, "([^\\d]{1})" + RegexReplace(unitMatch, "\\.", "\\\.", true) + "\\b", "$1" + toUnit + cmbTo.Text, true);

			if (selection == selectionBefore) {
				// Something went wrong as nothing got replaced
				Script.ClearMessages;
				Script.Message("Error: Could not find match for: " + unitMatch);
				break;
			}

			unitMatch = RegexMatch(selection, "\\d*\\.?\\d*" + cmbFrom.Text, true);	// Get next match
			len = Length(unitMatch);
		}
		// Update editor selection
		Editor.SelText = selection;

	}

	// Start the main plugin function
	main();
}

function OnInstalled() {
  alert("CSS Unit Converter 1.0 by Peter Klein installed sucessfully!");
}

Script.ConnectSignal("installed", "OnInstalled");
Script.RegisterDocumentAction("", "Convert CSS Units", "Ctrl+Shift+U", "ShowUnitConverter");