using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ArcGIS.Desktop.Framework;
using ArcGIS.Desktop.Framework.Contracts;
using System.Windows.Input;

namespace CampingsExcelDropHandler
{
    internal class ZoomIn : Button
    {
        protected override void OnClick()
        {
            var cmdZoomIn = FrameworkApplication.GetPlugInWrapper(DAML.Button.esri_mapping_fixedZoomInButton) as ICommand;
            if (cmdZoomIn.CanExecute(null)) cmdZoomIn.Execute(null);

        }
    }
}
