add_python_test(worker PLUGIN worker)

add_python_style_test(
    python_static_analysis_worker "${PROJECT_SOURCE_DIR}/plugins/worker/server")
add_python_style_test(
    python_static_analysis_worker_tests "${PROJECT_SOURCE_DIR}/plugins/worker/plugin_tests")

add_eslint_test(
    worker "${PROJECT_SOURCE_DIR}/plugins/worker/web_client/js")
